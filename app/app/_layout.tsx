import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View, Alert, FlatList, useColorScheme } from "react-native";
import "../global.css";

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          className={`${scheme === "dark" ? "bg-dark" : "bg-white"} h-full`}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </View>
      </GestureHandlerRootView>
    </Provider>
  );
}
