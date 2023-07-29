import React, { useState } from "react";
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
  autoCapitalizeEmail?:
    | "none"
    | "sentences"
    | "words"
    | "characters"
    | undefined;
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
  autoCapitalizeEmail,
}) => {
  const [focused, setFocused] = useState(false);

  // Function to handle focus events
  const handleFocus = () => {
    setFocused(true);
  };

  // Function to handle blur events
  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <View style={[styles.container, focused && styles.focusedContainer]}>
      <TextInput
        style={[styles.textInput]}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onTextChange}
        editable={editable}
        onPressIn={onPressIn}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor="#919090"
        autoCapitalize={autoCapitalizeEmail}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F9FBFC",
    borderColor: "#eaeaea",
    borderWidth: 1.5,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textInput: {
    fontWeight: "bold",
  },
  focusedContainer: {
    width: "100%",
    backgroundColor: "#F9FBFC",
    borderColor: "#878787",
    borderWidth: 1.5,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
