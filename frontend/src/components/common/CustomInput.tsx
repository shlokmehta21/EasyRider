import React from "react";
import { TextInput, View, StyleSheet, KeyboardTypeOptions } from "react-native";

type CustomInputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onTextChange: (text: string) => void;
  editable?: boolean;
  onPressIn?: () => void;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
};

export const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  secureTextEntry,
  value,
  onTextChange,
  editable,
  onPressIn,
  keyboardType,
  maxLength,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onTextChange}
        editable={editable}
        onPressIn={onPressIn}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor="#919090"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F9FBFC",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textInput: {
    fontWeight: "bold",
  },
});
