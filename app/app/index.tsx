import React from "react";
import { View, Dimensions, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { uiConfig } from "@/constants";
import CarouselItem from "@/components/CarouselItem";

const { width: windowWidth } = Dimensions.get("window");

interface CarouselItemData {
  title: string;
  animations: any;
  description: string;
  titleButton: string;
  path: "/download-video" | "/segment-video" | "/watch-video" | "/";
}

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

  const renderItem = ({ item }: { item: CarouselItemData }) => (
    <CarouselItem
      item={item}
      onPress={() => {
        router.push(item.path);
      }}
    />
  );

  return (
    <SafeAreaView
      className={`flex-1 h-full flex items-center justify-center ${
        scheme === "dark" ? "bg-dark text-white" : "bg-white text-mediumGrey"
      }`}
    >
      <View className="h-[90%]">
        <Carousel
          ref={ref}
          loop
          width={windowWidth}
          autoPlay
          autoPlayInterval={5000}
          data={uiConfig.mainPages}
          scrollAnimationDuration={1000}
          onProgressChange={progress}
          renderItem={renderItem}
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
