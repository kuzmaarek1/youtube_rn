import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View, Alert, FlatList, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSegmentVideoMutation } from "@/api/videoApi";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

type SegmentFormData = {
  segment_duration: string;
};

const SegmentVideoForm = () => {
  const [segments, setSegments] = useState<string[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SegmentFormData>();
  const { downloadFile } = useDownloadFile();
  const scheme = useColorScheme();

  const handleSegmentSubmit = async (data: SegmentFormData) => {
    const segmentDuration = parseInt(data.segment_duration, 10);
    if (isNaN(segmentDuration) || segmentDuration <= 0) {
      Alert.alert("Błąd", "Proszę wprowadzić poprawny czas segmentu.");
      return;
    }
    try {
      const result = await segmentVideo({
        ...data,
        input_file: "./ds.mp3",
      }).unwrap();
      setSegments(result.segments);
      console.log("Segment video successfully");
    } catch (err) {
      console.error("Failed to segment video", err);
    }
  };

  const [segmentVideo, { isLoading, isError, isSuccess, error }] =
    useSegmentVideoMutation();

  const hadleDownloadFile = async (file: string) => {
    await downloadFile(
      `http://192.168.0.112:8000/download-file?file_path=./films/${file}`,
      file
    );
  };

  const hadleDownloadAllFiles = async (file: string) => {
    const url = `http://192.168.0.112:8000/download-files?file_paths=${segments
      .map((file) => `./films/${file}`)
      .join("&file_paths=")}`;
    await downloadFile(url, file);
  };

  console.log(segments);
  return (
    <SafeAreaView
      className={`h-full ${
        scheme === "dark" ? "bg-dark" : "bg-white"
      } p-4 bg-darkGrey`}
    >
      <Text className="text-blue-500 font-bold text-xl mb-4">
        Segment Video
      </Text>

      <Controller
        name="segment_duration"
        control={control}
        defaultValue=""
        rules={{
          required: "Segment duration is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Please enter a valid number",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            name="SEGMENT DURATION"
          />
        )}
      />
      {errors.segment_duration && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {errors.segment_duration.message}
        </Text>
      )}

      <View className="w-full justify-center items-center mt-4">
        <CustomButton
          title="Segment Video"
          onPress={handleSubmit(handleSegmentSubmit)}
          isLoading={isLoading}
        />
      </View>
      {segments?.length > 0 && (
        <View className="mt-6">
          <Text className="text-blue-500 font-bold text-lg mb-2">
            Segments:
          </Text>
          <FlatList
            data={segments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="flex flex-row  items-center">
                <Text style={{ marginBottom: 8, color: "black" }}>{item}</Text>
                <CustomButton
                  title="Dowload"
                  onPress={() => hadleDownloadFile(item)}
                  isLoading={false}
                />
              </View>
            )}
          />
        </View>
      )}
      <CustomButton
        title="Download all"
        onPress={() => hadleDownloadAllFiles("all.zip")}
        isLoading={false}
      />
    </SafeAreaView>
  );
};

export default SegmentVideoForm;
