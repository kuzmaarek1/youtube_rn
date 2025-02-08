import animations from "./animations";

const tabScreens = [
  {
    name: "downloand-video",
    title: "Download Video",
    sourceImage: require("@/assets/icons/youtube.png"),
  },
  {
    name: "segment-video",
    title: "Segment Video",
    sourceImage: require("@/assets/icons/file.png"),
  },
  {
    name: "watch-video",
    title: "Watch Video",
    sourceImage: require("@/assets/icons/file.png"),
  },
];

const mainPages = [
  {
    id: "0",
    title: "YouTube Video Downloader",
    description:
      "Easily download videos from YouTube by providing a video URL and save them to your device",
    backgroundColor: "#22c55e",
    animations: animations.downloandVideo,
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
  {
    id: "2",
    title: "Watch Videos & Listen to Audio",
    description:
      "Play your downloaded videos and audio files directly from your device with an easy-to-use media player.",
    backgroundColor: "#3b82f6",
    animations: animations.watchVideo,
    titleButton: "Watch",
    path: "/watch-video",
  },
];

export default { tabScreens, mainPages };
