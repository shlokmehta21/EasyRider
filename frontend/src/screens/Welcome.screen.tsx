import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { CustomButton } from "../components/common/CustomButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface WelcomeProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={styles.txtWrapper}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.description}>
          We're so glad you're here! Please select an option below to get
          started.
        </Text>
      </View>
      <Image
        style={[styles.image, { height: height * 0.6 }]}
        source={require("../../assets/appimages/Welcome.png")}
        resizeMode="contain"
      />
      <View style={styles.btnWrapper}>
        <CustomButton
          title="Sign In"
          backGroundColor="black"
          color="white"
          onPress={() => navigation.navigate("Login")}
        />
        <CustomButton
          title="Sign Up"
          backGroundColor="#d2d2d4"
          color="black"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  image: {
    width: "100%",
    maxWidth: 600,
    maxHeight: 350,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    letterSpacing: 1,
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    letterSpacing: 0.5,
    color: "#686869",
  },
  txtWrapper: {
    marginTop: 15,
    width: "100%",
  },
  btnWrapper: {
    alignItems: "flex-end",
    width: "100%",
  },
});
