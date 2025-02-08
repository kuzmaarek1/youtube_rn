import { useEffect, useState } from "react";
import { LayoutChangeEvent, View, useColorScheme } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButton from "@/components/TabBarButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const scheme = useColorScheme();
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;

  const colors = {
    primary: scheme === "dark" ? "#181818" : "white",
    text: scheme === "dark" ? "white" : "#181818",
  };

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    tabPositionX.value = state.index * buttonWidth;
  }, [buttonWidth, state.index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      onLayout={onTabbarLayout}
      className={`flex-row items-center justify-between absolute bottom-1 left-0 right-0 py-1 rounded-2xl ${
        scheme === "dark" ? "bg-dark" : "bg-white"
      }`}
    >
      <Animated.View
        className={`absolute ${
          scheme === "dark" ? "bg-white" : "bg-mediumGrey"
        } rounded-lg mx-4`}
        style={[
          animatedStyle,
          {
            height: dimensions.height - 15,
            width: buttonWidth - 25,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withTiming(index * buttonWidth, {
            duration: 300,
          });

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            route={{ name: route.name, params: route.params }}
            color={isFocused ? colors.primary : colors.text}
            label={label}
            options={{
              tabBarAccessibilityLabel: options.tabBarAccessibilityLabel,
              tabBarTestID: options.tabBarButtonTestID,
            }}
          />
        );
      })}
    </View>
  );
};

export default TabBar;
