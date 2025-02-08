import { useState } from "react";
import { View, Button, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useVideoPlayer, VideoView } from "expo-video";

const WatchMedia = () => {
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const playerMedia = useVideoPlayer(mediaUri, (player) => {
    player.loop = false;
    player.staysActiveInBackground = true;
    player.showNowPlayingNotification = true;
  });

  const pickMedia = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["video/mp4", "audio/mpeg"],
    });

    if (result?.assets?.[0]?.uri) {
      setMediaUri(result.assets[0].uri);
      setMediaType(
        result.assets[0].mimeType?.startsWith("video") ? "video" : "audio"
      );
    }
  };

  return (
    <View className="mt-7">
      <Button title="Wybierz plik MP3/MP4" onPress={pickMedia} />
      {mediaUri && (mediaType === "video" || mediaType === "audio") && (
        <VideoView
          style={{
            width: "100%",
            height: 250,
            borderRadius: 12,
          }}
          player={playerMedia}
          allowsFullscreen
          allowsPictureInPicture={mediaType === "video" ? true : false}
          startsPictureInPictureAutomatically={
            mediaType === "video" ? true : false
          }
        />
      )}
    </View>
  );
};

export default WatchMedia;
