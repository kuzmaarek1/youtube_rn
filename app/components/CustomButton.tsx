import React from "react";
import { Text, ActivityIndicator, View } from "react-native";
import ReallyAwesomeButton from "react-native-really-awesome-button";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  isLoading,
}) => {
  return (
    <View style={{ width: "60%" }}>
      <ReallyAwesomeButton
        progress
        onPress={async (next) => {
          await onPress();
          next();
        }}
        borderRadius={25}
        raiseLevel={0}
        width={200}
        height={50}
        disabled={isLoading}
        borderWidth={2}
        borderColor={"#ff0000"}
        textColor={"#ff0000"}
        backgroundColor={"#ffffff"}
        style={{ backgroundColor: isLoading ? 1 : 1 }}
      >
        {title}
      </ReallyAwesomeButton>
    </View>
  );
};

export default CustomButton;
