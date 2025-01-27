import { Text } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { uiConfig } from "@/constants";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        {uiConfig.tabScreens.map(({ name, title }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: title,
              headerShown: false,
              tabBarIcon: ({ color, focused }) => <Text>{name}</Text>,
            }}
          />
        ))}
        <StatusBar backgroundColor="transparent" />
      </Tabs>
    </>
  );
}
