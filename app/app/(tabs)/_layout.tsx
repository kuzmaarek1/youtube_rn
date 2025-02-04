import { Text, Image } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { uiConfig } from "@/constants";
import { Asset } from "expo-asset";
import TabBar from "@/components/TabBar";

export default function TabLayout() {
  return (
    <>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      >
        {uiConfig.tabScreens.map(({ name, title }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: title,
              headerShown: false,
            }}
          />
        ))}
        <StatusBar backgroundColor="transparent" />
      </Tabs>
    </>
  );
}
