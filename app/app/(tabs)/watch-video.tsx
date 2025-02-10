import { useState } from "react";
import { View, Text, Button, useColorScheme } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import LottieView from "lottie-react-native";
import { uiConfig } from "@/constants";
import CustomButton from "@/components/CustomButton";

const WatchMedia = () => {
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const scheme = useColorScheme();

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
    <SafeAreaView
      className={`${scheme === "dark" ? "bg-dark" : "bg-white"} h-full p-4`}
    >
      <View className="flex h-full justify-center">
        <View className="flex h-[90%] gap-1">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "70%",
            }}
          >
            {!(mediaUri && (mediaType === "video" || mediaType === "audio")) ? (
              <>
                <Text
                  className={`px-3 pt-9 text-center text-2xl mt-6 font-semibold ${
                    scheme === "dark" ? "text-white" : " text-mediumGrey"
                  }`}
                >
                  Watch Videos & Listen to Audio
                </Text>
                <LottieView
                  source={uiConfig.mainPages[2].animations}
                  style={{ width: "100%", height: "90%" }}
                  autoPlay
                  loop
                />
              </>
            ) : (
              <>
                <Text
                  className={`px-3 pt-9 text-center text-2xl mt-6 font-semibold ${
                    scheme === "dark" ? "text-white" : " text-mediumGrey"
                  }`}
                >
                  Selected files
                </Text>
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
              </>
            )}
          </View>
          <View
            className={`${
              scheme === "dark" ? "bg-mediumGrey" : "bg-lightGrey"
            } mb-[50px] mx-[10px] px-[25px] py-[20px] flex  items-center justify-center bg-green-500 rounded-3xl`}
          >
            <View className="flex w-full justify-center items-center flex-row gap-2">
              <View className="w-[60%] justify-center items-center">
                <CustomButton
                  title={`Wybierz plik \n MP3/MP4`}
                  onPress={pickMedia}
                  isLoading={false}
                  progressPercent={0}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WatchMedia;
