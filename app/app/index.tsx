import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Platform, Alert } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDownloadVideoMutation } from "@/api/videoApi";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

type FormData = {
  url: string;
};

export default function HomeScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const { downloadFile } = useDownloadFile();

  const onSubmit = async (data: FormData) => {
    try {
      await downloadVideo({ url: data.url }).unwrap();
      console.log("Video downloaded successfully");
    } catch (err) {
      console.error("Failed to download video", err);
    }
  };

  const handleDownloadFile = async () => {
    await downloadFile(
      "http://192.168.0.113:8000/download-file?file_path=./ds.mp3",
      "ds.mp3"
    );
  };

  const [downloadVideo, { isLoading, isError, isSuccess, error }] =
    useDownloadVideoMutation();

  return (
    <SafeAreaView className="bg-green-500 h-full p-4 text-black">
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
          />
        </View>
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
}
