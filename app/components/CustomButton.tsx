import React, { useState, useEffect } from "react";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

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

  const buttonBgColor =
    scheme === "dark"
      ? isLoading
        ? "bg-mediumGrey"
        : "bg-white"
      : isLoading
      ? "bg-white"
      : "bg-mediumGrey";

  const borderColor = scheme === "dark" ? "border-grey" : "border-mediumGrey";
  return (
    <View
      className={`flex items-center justify-center mt-8 ${
        scheme === "dark" ? "text-mediumGrey" : "text-white"
      }`}
    >
      <TouchableOpacity
        className={`relative w-48 h-12 justify-center items-center border-2 ${borderColor} ${buttonBgColor}`}
        onPress={onPress}
        disabled={isLoading}
      >
        <Animated.View
          className="absolute top-0 left-0 bottom-0"
          style={{ width: fillWidth }}
        />
        <Text
          className={`font-bold text-lg ${
            scheme === "dark" ? "text-mediumGrey" : "text-white"
          }`}
        >
          {isLoading ? `${progressPercent}%` : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
