import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Text,
  View,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Picker } from "@react-native-picker/picker";
import { useKeyboard } from "@react-native-community/hooks";
import { uiConfig } from "@/constants";
import { useDownloadVideoMutation } from "@/api/videoApi";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

type FormData = {
  url: string;
  format: string;
};

const DownloadVideo = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      url: "",
      format: "mp3",
    },
  });

  const [progress, setProgress] = useState<number>(0);
  const [selectedFormat, setSelectedFormat] = useState<string>("mp3");
  const { downloadFile } = useDownloadFile();
  const scheme = useColorScheme();
  const isKeyboardVisible = useKeyboard().keyboardShown;
  const userId = "123";

  const animationHeight = useRef(new Animated.Value(70)).current;

  useEffect(() => {
    const socket = new WebSocket(
      `ws://192.168.0.101:8000/ws/progress/${userId}`
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

  useEffect(() => {
    Animated.timing(animationHeight, {
      toValue: isKeyboardVisible ? 20 : 70,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isKeyboardVisible]);

  const onSubmit = async (data: FormData) => {
    console.log({ ...data, userId });
    try {
      setProgress(0);
      await downloadVideo({ ...data, userId }).unwrap();
      console.log("Video downloaded successfully");
    } catch (err) {
      console.error("Failed to download video", err);
    } finally {
      setProgress(100);
    }
  };

  const handleDownloadFile = async () => {
    await downloadFile(
      `http://192.168.0.101:8000/download-file?file_path=./ds.${selectedFormat}`,
      `ds.${selectedFormat}`
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
          <View className="flex h-full justify-center">
            <View className="flex h-[90%] gap-1">
              <Animated.View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: `${animationHeight}%`,
                  transition: "all 0.3s",
                }}
              >
                {!isKeyboardVisible && (
                  <Text
                    className={`px-3 pt-9 text-center text-2xl mt-6 font-semibold ${
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
              </Animated.View>
              <View
                className={`${
                  scheme === "dark" ? "bg-mediumGrey" : "bg-lightGrey"
                } mb-[50px] mx-[10px] px-[25px] py-[20px] flex  justify-center bg-green-500 rounded-3xl`}
              >
                {isKeyboardVisible && (
                  <Text
                    className={`px-3 text-center text-xl mt-6 font-semibold ${
                      scheme === "dark" ? "text-white" : "text-mediumGrey"
                    }`}
                  >
                    YouTube Video Downloader
                  </Text>
                )}
                <View className="flex w-full justify-center items-center flex-row gap-2">
                  <View className="w-[60%] justify-center">
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
                  <View className="w-[40%] justify-center mt-[8px]">
                    <Text
                      className={`text-center w-full text-[13px] mb-[4px] font-bold uppercase ${
                        scheme === "dark" ? "text-white" : "text-mediumGrey"
                      }`}
                    >
                      Format
                    </Text>
                    <View className="h-[48px] opacity-0" />
                    <View className="relative">
                      <View
                        className={`absolute top-[-48px] h-[48px] w-full flex justify-center items-center`}
                        style={{
                          backgroundColor:
                            scheme === "dark" ? "#ffffff" : "#3d3d3d",
                          color: scheme === "dark" ? "#3d3d3d" : "#ffffff",
                          height: 48,
                        }}
                      >
                        <Text
                          className={`uppercase font-bold text-[17px] ${
                            scheme === "dark" ? "text-mediumGrey" : "text-white"
                          }`}
                        >
                          {watch("format")}
                        </Text>
                      </View>
                      <Picker
                        selectedValue={selectedFormat}
                        prompt="Format"
                        onValueChange={(itemValue) => {
                          setValue("format", itemValue);
                          setSelectedFormat(itemValue);
                        }}
                        style={{
                          backgroundColor:
                            scheme === "dark" ? "#ffffff" : "#3d3d3d",
                          fontWeight: 700,
                          color: scheme === "dark" ? "#3d3d3d" : "#ffffff",
                          height: 48,
                          fontSize: 50,
                          width: "100%",
                          opacity: 0,
                          position: "absolute",
                          top: -48,
                        }}
                      >
                        <Picker.Item label="MP4" value="mp4" />
                        <Picker.Item label="MP3" value="mp3" />
                      </Picker>
                    </View>
                  </View>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DownloadVideo;
