import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomButton from "@/components/CustomButton";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  scheme: any;
  type: "success" | "error";
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  message,
  scheme,
  type,
}) => {
  const iconName = type === "success" ? "checkmark-circle" : "alert-circle";
  const iconColor = type === "success" ? "green" : "#e31010";
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              className={`relative py-[30px] min-w-[75%] ${
                scheme === "dark" ? "bg-mediumGrey" : "bg-lightGrey"
              } mb-[50px] mx-[10px] px-[25px] py-[20px] flex justify-center w-[200px] rounded-3xl`}
            >
              <View className="flex items-center mb-2">
                <Ionicons name={iconName} size={150} color={iconColor} />
              </View>
              <TouchableOpacity
                className="absolute top-1 right-2 p-2"
                onPress={onClose}
              >
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={scheme === "dark" ? "white" : "#3d3d3d"}
                />
              </TouchableOpacity>
              <Text
                className={`px-3 text-center text-2xl font-semibold ${
                  scheme === "dark" ? "text-white" : " text-mediumGrey"
                }`}
              >
                {type === "success" ? "Success" : "Error"}
              </Text>

              <Text
                className={`text-center px-6 text-lg mt-2 ${
                  scheme === "dark" ? "text-white" : " text-mediumGrey"
                }`}
              >
                {message}
              </Text>
              <View className="mt-2">
                <CustomButton
                  title="OK"
                  onPress={onClose}
                  isLoading={false}
                  progressPercent={0}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;
