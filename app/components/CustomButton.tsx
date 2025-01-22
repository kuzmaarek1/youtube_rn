import React, { useState, useEffect } from "react";
import { Animated, Text, View, TouchableOpacity } from "react-native";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  isLoading: boolean;
  progressPercent: number;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  isLoading,
  progressPercent,
}) => {
  const [fillAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isLoading) {
      Animated.timing(fillAnimation, {
        toValue: progressPercent,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [isLoading, progressPercent]);

  const fillWidth = fillAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex items-center justify-center mt-8">
      <TouchableOpacity
        className="relative w-48 h-12 justify-center items-center border-2 border-red-500"
        style={{ backgroundColor: isLoading ? "#f0f0f0" : "#ff0000" }}
        onPress={onPress}
        disabled={isLoading}
      >
        <Animated.View
          className="absolute top-0 left-0 bottom-0 rounded-xl"
          style={{ width: fillWidth, backgroundColor: "#ff0000" }}
        />
        <Text className={"text-white font-bold text-lg"}>
          {isLoading ? `${progressPercent}%` : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
