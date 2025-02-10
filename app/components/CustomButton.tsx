import React from "react";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import * as Progress from "react-native-progress";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  isLoading: boolean;
  progressPercent: number;
}

const CustomButton = ({
  title,
  onPress,
  isLoading,
  progressPercent,
}: CustomButtonProps) => {
  const scheme = useColorScheme();

  const buttonBgColor = scheme === "dark" ? "bg-white" : "bg-mediumGrey";
  const borderColor = scheme === "dark" ? "border-grey" : "border-darker";
  console.log(`progressPercent: ${progressPercent}`);

  return (
    <View
      className={`flex items-center justify-center ${
        scheme === "dark" ? "text-mediumGrey" : "text-white"
      }`}
    >
      {!isLoading ? (
        <TouchableOpacity
          className={`relative w-[165px] h-[50px] justify-center items-center border-[1px] rounded-[10px] ${borderColor} ${buttonBgColor}`}
          onPress={onPress}
          disabled={isLoading}
        >
          <Text
            className={`font-bold text-[15px] text-center ${
              scheme === "dark" ? "text-mediumGrey" : "text-white"
            }`}
          >
            {title}
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="relative w-[165px]">
          <Progress.Bar
            progress={progressPercent / 100}
            width={165}
            height={48}
            borderRadius={10}
            borderWidth={1}
            borderColor={scheme === "dark" ? "#8d8686" : "#212121"}
            color={scheme === "dark" ? "#ffffff" : "#3d3d3d"}
            indeterminate={
              progressPercent === 0 || progressPercent === undefined
            }
          />
          <Text
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[16px] font-bold text-darker`}
          >
            {progressPercent.toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
};

export default CustomButton;
