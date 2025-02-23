import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const useDownloadFile = () => {
  const saveFile = async (uri: string, filename: string, mimetype: string) => {
    try {
      mimetype = mimetype && mimetype.trim() ? mimetype : "audio/mpeg";
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const fileUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              filename,
              mimetype
            );
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          Alert.alert(
            "Success",
            "The file has been saved in the selected folder"
          );
        } else {
          await handleShare(uri);
        }
      } else {
        await handleShare(uri);
      }
    } catch (error) {
      console.error("Error while saving the file", error);
      Alert.alert("Error", "Failed to save the file");
    }
  };

  const handleShare = async (uri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("No sharing options available", "Unable to share the file");
      }
    } catch (error) {
      console.error("Error while sharing the file: ", error);
      Alert.alert("Error", "Failed to share the file");
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + filename;
      const result = await FileSystem.downloadAsync(url, fileUri);
      await saveFile(result.uri, filename, result?.headers["content-type"]);
      console.log("Deleting file from sandbox...");
      await FileSystem.deleteAsync(fileUri);
      console.log("File has been deleted:", fileUri);
    } catch (error) {
      console.error("Error while downloading the file:", error);
    }
  };

  return {
    downloadFile,
  };
};
