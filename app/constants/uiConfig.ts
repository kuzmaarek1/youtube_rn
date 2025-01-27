import animations from "./animations";

const tabScreens = [
  {
    name: "downloand-video",
    title: "Download Video",
  },
  {
    name: "segment-video",
    title: "Segment Video",
  },
];

const mainPages = [
  {
    id: "0",
    title: "YouTube Video Downloader",
    description:
      "Easily download videos from YouTube by providing a video URL and save them to your device",
    backgroundColor: "#22c55e",
    animations: animations.youtubeAnimation,
    titleButton: "Download",
    path: "/downloand-video",
  },
  {
    id: "1",
    title: "Video Segmentation Tool",
    description:
      "Easily split your MP3 file into smaller segments by specifying the duration. Download individual segments or all of them at once.",
    backgroundColor: "#3b82f6",
    animations: animations.segmentAnimation,
    titleButton: "Segment",
    path: "/segment-video",
  },
];

export default { tabScreens, mainPages };
