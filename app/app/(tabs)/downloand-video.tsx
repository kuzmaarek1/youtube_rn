import React, { useState, useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Text,
  View,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useKeyboard } from "@react-native-community/hooks";
import { useDownloadVideoMutation } from "@/api/videoApi";
import { uiConfig } from "@/constants";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

type FormData = {
  url: string;
};

const HomeScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [progress, setProgress] = useState<number>(0);
  const { downloadFile } = useDownloadFile();
  const scheme = useColorScheme();
  const isKeyboardVisible = useKeyboard().keyboardShown;
  const userId = "123";

  useEffect(() => {
    const socket = new WebSocket(
      `ws://192.168.0.112:8000/ws/progress/${userId}`
    );

    socket.onopen = () => console.log("Połączenie WebSocket otwarte");
    socket.onmessage = (event) => {
      const match = event.data.match(/Progress: (\d+(\.\d{1,2})?)%/);
      if (match) setProgress(parseFloat(match[1]));
    };
    socket.onerror = (error) => console.error("Błąd WebSocket:", error);
    socket.onclose = () => console.log("Połączenie WebSocket zamknięte");

    return () => socket.close();
  }, [userId]);

  const onSubmit = async (data: FormData) => {
    try {
      setProgress(0);
      await downloadVideo({ url: data.url, userId }).unwrap();
      console.log("Video downloaded successfully");
    } catch (err) {
      console.error("Failed to download video", err);
    } finally {
      setProgress(100);
    }
  };

  const handleDownloadFile = async () => {
    await downloadFile(
      "http://192.168.0.112:8000/download-file?file_path=./ds.mp3",
      "ds.mp3"
    );
  };

  const [downloadVideo, { isLoading, isError, isSuccess, error }] =
    useDownloadVideoMutation();

  console.log(progress);

  return (
    <SafeAreaView
      className={`${scheme === "dark" ? "bg-dark" : "bg-white"} h-full p-4`}
    >
      <StatusBar backgroundColor={"transparent"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex h-full">
            <View
              className={`flex justify-center items-center w-full transition-all duration-300 ${
                isKeyboardVisible ? "h-[20%]" : "h-[70%]"
              }`}
            >
              {!isKeyboardVisible && (
                <Text
                  className={`px-3 text-center text-xl mt-6 font-semibold ${
                    scheme === "dark" ? "text-white" : " text-mediumGrey"
                  }`}
                >
                  YouTube Video Downloader
                </Text>
              )}
              <LottieView
                source={uiConfig.mainPages[0].animations}
                style={{ width: "100%", height: "90%" }}
                autoPlay
                loop
              />
            </View>
            <View
              className={`${
                scheme === "dark" ? "bg-mediumGrey" : "bg-lightGrey"
              } pb-[30px] flex justify-center bg-green-500 rounded-3xl ${
                isKeyboardVisible ? "mt-[-5px] h-[80%]" : "mt-[-70px] h-[35%]"
              } `}
            >
              <View className="mx-4">
                {isKeyboardVisible && (
                  <Text
                    className={`px-3 text-center text-xl mt-6 font-semibold ${
                      scheme === "dark" ? "text-white" : "text-mediumGrey"
                    }`}
                  >
                    YouTube Video Downloader
                  </Text>
                )}
                <Controller
                  name="url"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "URL is required",
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(\/[\w\-./?%&=]*)?$/i,
                      message: "Enter a valid URL",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      name="URL"
                    />
                  )}
                />
                {errors.url && (
                  <Text style={{ color: "red", marginBottom: 10 }}>
                    {errors.url.message}
                  </Text>
                )}
              </View>
              <View className="w-full justify-center items-center">
                {progress !== 100 ? (
                  <CustomButton
                    title="Submit"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={isLoading}
                    progressPercent={progress}
                  />
                ) : (
                  <CustomButton
                    title="Download File"
                    onPress={handleDownloadFile}
                    isLoading={false}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
