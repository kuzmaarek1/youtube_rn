from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import yt_dlp
import os
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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
