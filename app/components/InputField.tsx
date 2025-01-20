import { View } from "react-native";
import React from "react";
import { Jiro } from "react-native-textinput-effects";

type InputFieldProps = {
  value: string;
  onChange: (text: string) => void;
  onBlur: () => void;
};

const InputField: React.FC<InputFieldProps> = ({ value, onChange, onBlur }) => {
  return (
    <Jiro
      label={"URL"}
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
      keyboardType="url"
      autoCapitalize="none"
      borderColor={"#ff0000"}
      labelStyle={{
        color: "#ff0000",
        fontWeight: "bold",
      }}
      inputStyle={{ color: "white", paddingRight: 30 }}
    />
  );
};

export default InputField;
