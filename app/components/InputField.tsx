import { View, useColorScheme } from "react-native";
import React from "react";
import { Jiro } from "react-native-textinput-effects";

type InputFieldProps = {
  value: string;
  name: string;
  onChange: (text: string) => void;
  onBlur: () => void;
};

const InputField: React.FC<InputFieldProps> = ({
  value,
  name,
  onChange,
  onBlur,
}) => {
  const scheme = useColorScheme();
  return (
    <Jiro
      label={name}
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
      //keyboardType="url"
      autoCapitalize="none"
      borderColor={scheme === "dark" ? "#ffffff" : "#3d3d3d"}
      labelStyle={{
        color: scheme === "dark" ? "#ffffff" : "#3d3d3d",
        fontWeight: "bold",
      }}
      inputStyle={{
        color: scheme === "dark" ? "#3d3d3d" : "#ffffff",
        paddingRight: 30,
        fontSize: 17,
      }}
    />
  );
};

export default InputField;
