import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Platform, Alert } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
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
    watch,
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

  const saveFile = async (uri: string, filename: string, mimetype: string) => {
    try {
      mimetype = mimetype && mimetype.trim() ? mimetype : "audio/mpeg";
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const fileUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              filename,
              mimetype
            );
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          Alert.alert("Sukces", "Plik został zapisany w wybranym folderze.");
        } else {
          await handleShare(uri);
        }
      } else {
        await handleShare(uri);
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania pliku:", error);
      Alert.alert("Błąd", "Nie udało się zapisać pliku.");
    }
  };

  const handleShare = async (uri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Brak opcji udostępniania", "Nie można udostępnić pliku.");
      }
    } catch (error) {
      console.error("Błąd podczas udostępniania pliku:", error);
      Alert.alert("Błąd", "Nie udało się udostępnić pliku.");
    }
  };

  const handleDownloadFile = async () => {
    try {
      const filename = "ds.mp3";
      const fileUri = FileSystem.documentDirectory + filename;
      const result = await FileSystem.downloadAsync(
        "http://192.168.0.113:8000/download-file",
        fileUri
      );
      await saveFile(result.uri, filename, result?.headers["content-type"]);
      console.log("Usuwanie pliku z sandboxu...");
      await FileSystem.deleteAsync(fileUri);
      console.log("Plik został usunięty:", fileUri);
    } catch (error) {
      console.error("Błąd podczas obsługi pliku:", error);
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
