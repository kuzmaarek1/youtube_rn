import { View } from "react-native";
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
  return (
    <Jiro
      label={name}
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
      //keyboardType="url"
      autoCapitalize="none"
      borderColor={"#606060"}
      labelStyle={{
        color: "#606060",
        fontWeight: "bold",
      }}
      inputStyle={{ color: "white", paddingRight: 30 }}
    />
  );
};

export default InputField;
