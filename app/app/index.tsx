import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const startScrollX = useRef(0);

  const viewableItemsChangedRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % pages.length;
      setActiveIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }, 10000); // co 10 sekund

    return () => clearInterval(interval); // czyszczenie interwału przy odmontowywaniu komponentu
  }, [activeIndex]);

  const renderItem = ({ item }) => {
    return (
      <View
        className="h-full justify-center items-center"
        style={{
          backgroundColor: item.backgroundColor,
          width: Dimensions.get("window").width,
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
            // navigate to download screen
            router.push("/downloand-video");
          }}
          isLoading={false}
        />
      </View>
    );
  };

  const handleScrollBeginDrag = (e) => {
    startScrollX.current = e.nativeEvent.contentOffset.x;
  };

  const handleScrollEndDrag = (e) => {
    const endScrollX = e.nativeEvent.contentOffset.x;
    const windowWidth = Dimensions.get("window").width;
    if (activeIndex === 0 && endScrollX === 0) {
      setActiveIndex(pages.length - 1);
      flatListRef.current.scrollToIndex({
        index: pages.length - 1,
        animated: true,
      });
    } else if (
      activeIndex === pages.length - 1 &&
      endScrollX >= (pages.length - 1) * windowWidth
    ) {
      setActiveIndex(0);
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  const handleDotPress = (index) => {
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  return (
    <SafeAreaView className="flex-1 h-full">
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={pages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChangedRef.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
      />
      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center mt-4">
        {pages.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
            <View
              style={{
                width: 11,
                height: 11,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: activeIndex === index ? "black" : "gray",
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
      <StatusBar backgroundColor="transparent" />
    </SafeAreaView>
  );
};

export default HomeScreen;
