import React, { useEffect } from "react";
import { PlatformPressable } from "@react-navigation/elements";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useLinkBuilder } from "@react-navigation/native";
import { icon } from "@/constants/tabBarIcon";
import { TouchableOpacity } from "react-native";

interface TabBarButtonProps {
  onPress: Function;
  onLongPress: Function;
  label: any;
  route: { name: string; params?: object };
  isFocused: boolean;
  color: string;
  options: {
    tabBarTestID?: string;
    tabBarAccessibilityLabel?: string;
  };
}

const TabBarButton = ({
  onPress,
  onLongPress,
  label,
  route,
  isFocused,
  color,
  options,
}: TabBarButtonProps) => {
  const { buildHref } = useLinkBuilder();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);

    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: 1 - scale.value,
  }));

  console.log(scale.value);
  console.log(animatedTextStyle);

  return (
    <PlatformPressable
      key={route.name}
      onPress={onPress}
      onLongPress={onLongPress}
      href={buildHref(route.name, route.params)}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      className="flex-1 justify-center items-center gap-1"
    >
      <Animated.View style={animatedIconStyle}>
        {icon[route.name]({
          color: color,
        })}
      </Animated.View>
      <Animated.Text style={[{ color: color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </PlatformPressable>
  );
};

export default TabBarButton;
