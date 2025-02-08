from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import uvicorn
import yt_dlp
import os
import ffmpeg
from fastapi.responses import FileResponse
from fastapi import Query
from zipfile import ZipFile
from typing import List
import asyncio
import mimetypes


app = FastAPI()


class URLRequest(BaseModel):
    url: str


active_websockets = {}


@app.websocket("/ws/progress/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    active_websockets[user_id] = websocket
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print(f"Klient {user_id} się rozłączył")
        del active_websockets[user_id]


async def send_progress_to_websocket(user_id: str, message: str):
    if user_id in active_websockets:
        websocket = active_websockets[user_id]
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Nie udało się wysłać wiadomości do użytkownika {user_id}: {e}")


def download_progress_hook(d, user_id):
    if d["status"] == "downloading":
        total_size = d.get("total_bytes", None)
        downloaded_size = d.get("downloaded_bytes", 0)
        if total_size:
            percentage = (downloaded_size / total_size) * 100
            print(f"Postęp pobierania dla użytkownika {user_id}: {percentage:.2f}%")
            asyncio.run(
                send_progress_to_websocket(user_id, f"Progress: {percentage:.2f}%")
            )


def run_blocking_download(url: str, user_id: str):
    """
    ydl_opts = {
        "extract_audio": True,
        "format": "bestaudio",
        "outtmpl": "ds.mp3",
        "progress_hooks": [lambda d: download_progress_hook(d, user_id)],
    }
    """
    ydl_opts = {
        "format": "mp4",
        "outtmpl": "ds.mp4",
        "progress_hooks": [lambda d: download_progress_hook(d, user_id)],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        return info_dict


@app.post("/download/{user_id}")
async def download_video(request: URLRequest, user_id: str):
    loop = asyncio.get_event_loop()
    try:
        info_dict = await loop.run_in_executor(
            None, run_blocking_download, request.url, user_id
        )
        title = info_dict.get("title", "Unknown title")
        if user_id in active_websockets:
            websocket = active_websockets[user_id]
            await websocket.send_text(f"Pobieranie zakończone: {title}")

        return {"message": f"Wideo '{title}' zostało pomyślnie pobrane!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/download-file")
async def download_file(file_path: str = Query(...)):
    if os.path.exists(file_path):
        filename = os.path.basename(file_path)
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type is None:
            mime_type = "application/octet-stream"

        return FileResponse(file_path, media_type=mime_type, filename=filename)
    else:
        raise HTTPException(status_code=404, detail="File not found")


@app.get("/download-files")
async def download_files(file_paths: List[str] = Query(...)):
    zip_filename = "downloaded_files.zip"

    if not file_paths:
        raise HTTPException(status_code=400, detail="No files provided.")

    for file_path in file_paths:
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

    with ZipFile(zip_filename, "w") as zipf:
        for file_path in file_paths:
            zipf.write(file_path, os.path.basename(file_path))

    return FileResponse(
        zip_filename, media_type="application/zip", filename=zip_filename
    )


class SplitRequest(BaseModel):
    input_file: str
    segment_duration: int


def split_mp3(input_file, segment_duration):
    output_dir = "films"
    os.makedirs(output_dir, exist_ok=True)
    try:
        ffmpeg.input(input_file).output(
            f"{output_dir}/%03d.mp3",
            f="segment",
            segment_time=segment_duration,
        ).run()
        print(f"Plik {input_file} został podzielony na segmenty.")
        return output_dir
    except ffmpeg.Error as e:
        print(f"Błąd podczas dzielenia pliku: {e}")
        return None


@app.post("/split")
async def split_file(request: SplitRequest):
    print(request)
    input_file = request.input_file
    segment_duration = int(request.segment_duration) * 60

    if not os.path.exists(input_file):
        raise HTTPException(status_code=404, detail="Input file not found")

    output_dir = split_mp3(input_file, segment_duration)

    if output_dir:
        segment_files = os.listdir(output_dir)
        segment_files = [f"{file}" for file in segment_files if file.endswith(".mp3")]
        return {
            "message": f"File '{input_file}' has been split successfully.",
            "segments": segment_files,
        }
    else:
        raise HTTPException(
            status_code=500, detail="Error occurred while splitting the file."
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
