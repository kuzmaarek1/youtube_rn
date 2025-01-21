from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import yt_dlp
import os
import ffmpeg
from fastapi.responses import FileResponse

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
async def download_file():
    file_path = "./ds.mp3"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg", filename="ds.mp3")
    else:
        raise HTTPException(status_code=404, detail="File not found")


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
        segment_files = [
            f"{output_dir}/{file}" for file in segment_files if file.endswith(".mp3")
        ]
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
