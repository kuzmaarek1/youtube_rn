import React from "react";
import { View, Text, Dimensions, useColorScheme } from "react-native";
import LottieView from "lottie-react-native";
import CustomButton from "@/components/CustomButton";

interface CarouselItemData {
  title: string;
  animations: any;
  description: string;
  titleButton: string;
}

interface CarouselItemProps {
  item: CarouselItemData;
  onPress: () => void;
}

const CarouselItem = ({ item, onPress }: CarouselItemProps) => {
  const { width: windowWidth } = Dimensions.get("window");
  const scheme = useColorScheme();

  return (
    <View
      className="h-full justify-center items-center"
      style={{
        width: windowWidth,
      }}
    >
      <Text
        className={`px-3 text-center text-4xl mt-6 font-semibold ${
          scheme === "dark" ? "text-white" : " text-mediumGrey"
        }`}
      >
        {item.title}
      </Text>
      <LottieView
        source={item.animations}
        style={{ width: "100%", height: "50%" }}
        autoPlay
        loop
      />
      <Text
        className={`text-center px-6 text-lg mt-2 ${
          scheme === "dark" ? "text-white" : " text-mediumGrey"
        }`}
      >
        {item.description}
      </Text>
      <View className="mt-6">
        <CustomButton
          title={item.titleButton}
          onPress={onPress}
          isLoading={false}
        />
      </View>
    </View>
  );
};

export default CarouselItem;
