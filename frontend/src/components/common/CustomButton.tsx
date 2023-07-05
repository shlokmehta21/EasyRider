import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

type CustomButtonProps = {
  title: string;
  color?: string;
  backGroundColor?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  diabled?: boolean;
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  color,
  backGroundColor,
  onPress,
  children,
  diabled,
}) => {
  return (
    <View
      style={[styles.container, { backgroundColor: backGroundColor }]}
      pointerEvents={diabled ? "none" : "auto"}
    >
      <TouchableOpacity onPress={onPress}>
        {children ? (
          children
        ) : (
          <Text style={[styles.text, { color: color }]}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 15,
  },
  text: {
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});
