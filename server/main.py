from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import yt_dlp
import os
import ffmpeg
from fastapi.responses import FileResponse
from fastapi import Query
from zipfile import ZipFile
from typing import List

app = FastAPI()


class URLRequest(BaseModel):
    url: str


@app.post("/download")
async def download_video(request: URLRequest):
    ydl_opts = {"extract_audio": True, "format": "bestaudio", "outtmpl": "ds.mp3"}
    print("pobieranie")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(request.url, download=True)
            title = info_dict.get("title", "Unknown title")
            return {"message": f"Video '{title}' has been downloaded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/download-file")
async def download_file(file_path: str = Query(...)):
    if os.path.exists(file_path):
        filename = os.path.basename(file_path)
        return FileResponse(file_path, media_type="audio/mpeg", filename=filename)
    else:
        raise HTTPException(status_code=404, detail="File not found")


@app.get("/download-files")
async def download_files(file_paths: List[str] = Query(...)):
    zip_filename = "downloaded_files.zip"

    if not file_paths:
        raise HTTPException(status_code=400, detail="No files provided.")

    print(file_paths)
    # Verify that all requested files exist
    for file_path in file_paths:
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

    # Create a ZIP file containing all requested files
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
