import React from "react";
import { View, Text } from "react-native";
import {
  UseFormSetValue,
  UseFormWatch,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { Picker } from "@react-native-picker/picker";

interface FormatPickerProps<T extends FieldValues> {
  name: Path<T>;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  scheme: any;
  containerStyle: any;
  items: { label: string; value: string }[];
}

const FormatPicker = <T extends FieldValues>({
  name,
  selectedFormat,
  setSelectedFormat,
  setValue,
  watch,
  scheme,
  containerStyle,
  items,
}: FormatPickerProps<T>) => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <View style={containerStyle}>
      <Text
        className={`text-center w-full text-[13px] mb-[4px] font-bold uppercase ${
          scheme === "dark" ? "text-white" : "text-mediumGrey"
        }`}
      >
        {capitalizeFirstLetter(name)}
      </Text>
      <View className="h-[48px] opacity-0" />
      <View className="relative">
        <View
          className="absolute top-[-48px] h-[48px] w-full flex justify-center items-center"
          style={{
            backgroundColor: scheme === "dark" ? "#ffffff" : "#3d3d3d",
            height: 48,
          }}
        >
          <Text
            className={`uppercase font-bold text-[17px] ${
              scheme === "dark" ? "text-mediumGrey" : "text-white"
            }`}
          >
            {watch(name)}
          </Text>
        </View>
        <Picker
          selectedValue={selectedFormat}
          prompt={capitalizeFirstLetter(name)}
          onValueChange={(itemValue: string) => {
            setValue(name, itemValue as PathValue<T, Path<T>>);
            setSelectedFormat(itemValue);
          }}
          style={{
            backgroundColor: scheme === "dark" ? "#ffffff" : "#3d3d3d",
            fontWeight: 700,
            color: scheme === "dark" ? "#3d3d3d" : "#ffffff",
            height: 48,
            fontSize: 50,
            width: "100%",
            opacity: 0,
            position: "absolute",
            top: -48,
          }}
        >
          {items.map(({ value, label }) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default FormatPicker;
