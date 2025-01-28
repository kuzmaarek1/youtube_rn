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
      borderColor={scheme === "dark" ? "#ffffff" : "#181818"}
      labelStyle={{
        color: scheme === "dark" ? "#ffffff" : "#181818",
        fontWeight: "bold",
      }}
      inputStyle={{
        color: scheme === "dark" ? "#181818" : "#ffffff",
        paddingRight: 30,
      }}
    />
  );
};

export default InputField;
