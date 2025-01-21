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
          Alert.alert("Sukces", "Plik został zapisany w wybranym folderze.");
        } else {
          await handleShare(uri);
        }
      } else {
        await handleShare(uri);
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania pliku:", error);
      Alert.alert("Błąd", "Nie udało się zapisać pliku.");
    }
  };

  const handleShare = async (uri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Brak opcji udostępniania", "Nie można udostępnić pliku.");
      }
    } catch (error) {
      console.error("Błąd podczas udostępniania pliku:", error);
      Alert.alert("Błąd", "Nie udało się udostępnić pliku.");
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + filename;
      const result = await FileSystem.downloadAsync(url, fileUri);
      await saveFile(result.uri, filename, result?.headers["content-type"]);
      console.log("Usuwanie pliku z sandboxu...");
      await FileSystem.deleteAsync(fileUri);
      console.log("Plik został usunięty:", fileUri);
    } catch (error) {
      console.error("Błąd podczas pobierania pliku:", error);
    }
  };

  return {
    downloadFile,
  };
};
