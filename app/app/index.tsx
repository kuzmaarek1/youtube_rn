import React from "react";
import { View, Text, Dimensions, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSharedValue } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { uiConfig } from "@/constants";
import CustomButton from "@/components/CustomButton";

const { width: windowWidth } = Dimensions.get("window");

const HomeScreen = () => {
  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const scheme = useColorScheme();

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View
        className="h-full justify-center items-center"
        style={{
          width: windowWidth,
        }}
      >
        <Text
          className={`px-3 text-center text-4xl mt-6 font-semibold ${
            scheme === "dark" ? "text-white" : " text-dark"
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
            scheme === "dark" ? "text-white" : " text-dark"
          }`}
        >
          {item.description}
        </Text>
        <CustomButton
          title={item.titleButton}
          onPress={() => {
            router.push(item.path);
          }}
          isLoading={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 h-full flex items-center justify-center ${
        scheme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
      }`}
    >
      <View className="h-[90%] gap-4">
        <Carousel
          ref={ref}
          loop
          width={windowWidth}
          autoPlay
          autoPlayInterval={5000}
          data={uiConfig.mainPages}
          scrollAnimationDuration={1000}
          onProgressChange={progress}
          renderItem={({ item }) => renderItem({ item })}
        />
        <Pagination.Basic<{ color: string }>
          progress={progress}
          data={[...new Array(uiConfig.mainPages.length).keys()]}
          size={15}
          dotStyle={{
            borderRadius: 100,
            backgroundColor: "#b2b2b2",
          }}
          activeDotStyle={{
            borderRadius: 100,
            overflow: "hidden",
            backgroundColor: scheme === "dark" ? "#ffffff" : "#181818",
          }}
          containerStyle={[
            {
              gap: 5,
              marginBottom: 10,
            },
          ]}
          horizontal
          onPress={onPressPagination}
        />
      </View>
      <StatusBar backgroundColor="transparent" />
    </SafeAreaView>
  );
};

export default HomeScreen;
