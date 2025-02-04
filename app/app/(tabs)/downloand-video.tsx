import React, { useState, useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDownloadVideoMutation } from "@/api/videoApi";
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
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const socket = useRef<WebSocket | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { downloadFile } = useDownloadFile();
  const scheme = useColorScheme();

  const userId = "123";

  useEffect(() => {
    socket.current = new WebSocket(
      `ws://192.168.0.112:8000/ws/progress/${userId}`
    );

    socket.current.onopen = () => {
      console.log("Połączenie WebSocket otwarte");
    };

    socket.current.onmessage = (event) => {
      const message = event.data;
      console.log(message);
      if (message.includes("Progress")) {
        const match = message.match(/Progress: (\d+(\.\d{1,2})?)%/);
        if (match) {
          setProgress(parseFloat(match[1]));
        }
      }
    };

    socket.current.onerror = (error) => {
      console.error("Błąd WebSocket:", error);
    };

    socket.current.onclose = () => {
      console.log("Połączenie WebSocket zamknięte");
    };

    return () => {
      if (socket.current) {
        socket.current.close();
        console.log("Połączenie WebSocket zostało zamknięte");
      }
    };
  }, [userId]);

  const onSubmit = async (data: FormData) => {
    try {
      setProgress(0);
      await downloadVideo({ url: data.url, userId: userId }).unwrap();
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
      className={`${
        scheme === "dark" ? "bg-dark" : "bg-white"
      } scheme h-full p-4 text-black`}
    >
      <View>
        <Text className="text-blue-500 font-bold text-2xl mb-4">
          URL Form Example
        </Text>
        <View className="mx-4">
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
          <CustomButton
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            progressPercent={progress}
          />
        </View>
        <Text>{progress}</Text>
        <View className="w-full justify-center items-center mt-4">
          <CustomButton
            title="Download File"
            onPress={handleDownloadFile}
            isLoading={false}
          />
        </View>
      </View>
      <CustomButton
        title="Segment video"
        onPress={() => {
          router.push("/segment-video");
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
