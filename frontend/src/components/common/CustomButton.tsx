import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

type CustomButtonProps = {
  title: string;
  color?: string;
  backGroundColor?: string;
  onPress?: () => void;
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  color,
  backGroundColor,
  onPress,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: backGroundColor }]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.text, { color: color }]}>{title}</Text>
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
