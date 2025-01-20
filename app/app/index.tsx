import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDownloadVideoMutation } from "@/api/videoApi";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

type FormData = {
  url: string;
};

export default function HomeScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await downloadVideo({ url: data.url }).unwrap();
      console.log("Video downloaded successfully");
    } catch (err) {
      console.error("Failed to download video", err);
    }
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
              <InputField value={value} onChange={onChange} onBlur={onBlur} />
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
      </View>
    </SafeAreaView>
  );
}
