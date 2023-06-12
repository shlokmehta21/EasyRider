import React, { useState, useEffect } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

type CustomImagePickerProps = {
  title: string;
  fieldName: string;
  setFieldValue: (valueString: string, data: {} | undefined) => void;
};

export const CustomImagePicker: React.FC<CustomImagePickerProps> = ({
  title,
  setFieldValue,
  fieldName,
}) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      const image = {
        fileSize: result?.assets[0].fileSize,
        base64: result?.assets[0].base64,
      };

      console.log(result?.assets[0].fileSize);

      setImage(result?.assets[0].uri);
      setFieldValue(fieldName, JSON.stringify(image));
    }
  };

  return (
    <Pressable style={styles.container} onPress={pickImage}>
      <View style={styles.uploadWrapper}>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.cirlceBtn}>
          {image ? (
            <Ionicons name="cloud-done" size={24} color="green" />
          ) : (
            <MaterialCommunityIcons
              name="cloud-upload"
              size={24}
              color="#2b2b2b"
            />
          )}
        </View>
      </View>

      {image && <Image source={{ uri: image }} style={styles.preViewImage} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F9FBFC",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 9,
    paddingHorizontal: 7,
    marginBottom: 15,
  },
  text: {
    color: "#919090",
    fontWeight: "700",
  },
  uploadWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cirlceBtn: {
    backgroundColor: "#e3e3e3",
    padding: 5,
    borderRadius: 100,
  },
  preViewImage: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 5,
  },
});
