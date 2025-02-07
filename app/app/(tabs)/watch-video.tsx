import { Text, View, Button } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const WatchVideo = () => {
  const playerVideo = useVideoPlayer(
    require("../../assets/ds.mp3"),
    (player) => {
      player.loop = false;
      player.staysActiveInBackground = true;
      player.showNowPlayingNotification = true;
    }
  );

  return (
    <View className="mt-7">
      <VideoView
        style={{
          width: "100%",
          height: 250,
          borderRadius: 12,
        }}
        player={playerVideo}
        allowsFullscreen
        allowsPictureInPicture
        startsPictureInPictureAutomatically
      />
    </View>
  );
};

export default WatchVideo;
