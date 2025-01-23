import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import CustomButton from "@/components/CustomButton";

const { width: windowWidth } = Dimensions.get("window");

const pages = [
  {
    id: "1",
    title: "First Page",
    description: "This is the first page",
    backgroundColor: "#22c55e",
  },
  {
    id: "2",
    title: "Second Page",
    description: "This is the second page",
    backgroundColor: "#3b82f6",
  },
  {
    id: "3",
    title: "Third Page",
    description: "This is the third page",
    backgroundColor: "#f59e0b",
  },
];

const HomeScreen = () => {
  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);

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
          backgroundColor: item.backgroundColor,
          width: windowWidth,
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: 120,
            height: 120,
          }}
        />
        <Text className="text-2xl text-white mt-6">{item.title}</Text>
        <Text className="text-base text-white mt-2">{item.description}</Text>
        <Text className="text-xs text-white mt-1">{item.id}</Text>
        <CustomButton
          title="Download File"
          onPress={() => {
            router.push("/downloand-video");
          }}
          isLoading={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 h-full">
      <Carousel
        ref={ref}
        loop
        width={windowWidth}
        height={Dimensions.get("window").height}
        autoPlay
        autoPlayInterval={5000}
        data={pages}
        scrollAnimationDuration={1000}
        onProgressChange={progress}
        renderItem={({ item }) => renderItem({ item })}
      />
      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={[...new Array(3).keys()]}
        size={20}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: "#262626",
        }}
        activeDotStyle={{
          borderRadius: 100,
          overflow: "hidden",
          backgroundColor: "#f1f1f1",
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
      <StatusBar backgroundColor="transparent" />
    </SafeAreaView>
  );
};

export default HomeScreen;
