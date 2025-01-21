import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View, Alert } from "react-native";
import { useSegmentVideoMutation } from "@/api/videoApi";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

type SegmentFormData = {
  segment_duration: string;
};

const SegmentVideoForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SegmentFormData>();

  const handleSegmentSubmit = async (data: SegmentFormData) => {
    const segmentDuration = parseInt(data.segment_duration, 10);
    if (isNaN(segmentDuration) || segmentDuration <= 0) {
      Alert.alert("Błąd", "Proszę wprowadzić poprawny czas segmentu.");
      return;
    }
    try {
      console.log({
        ...data,
        input_file: "./ds.mp3",
      });
      await segmentVideo({
        ...data,
        input_file: "./ds.mp3",
      }).unwrap();

      console.log("Segment video successfully");
    } catch (err) {
      console.error("Failed to segment video", err);
    }
  };

  const [segmentVideo, { isLoading, isError, isSuccess, error }] =
    useSegmentVideoMutation();

  return (
    <View className="mx-4 mt-4">
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
    </View>
  );
};

export default SegmentVideoForm;
