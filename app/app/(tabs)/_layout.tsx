import { Text, Image } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { uiConfig } from "@/constants";
import { Asset } from "expo-asset";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ffffff", //
          tabBarInactiveTintColor: "#181818",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 60,
          },
        }}
      >
        {uiConfig.tabScreens.map(({ name, title, sourceImage }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: title,
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <Image
                  style={{
                    width: 30,
                    height: 35,
                  }}
                  resizeMode="contain"
                  source={sourceImage}
                  color={color}
                />
              ),
            }}
          />
        ))}
        <StatusBar backgroundColor="transparent" />
      </Tabs>
    </>
  );
}
