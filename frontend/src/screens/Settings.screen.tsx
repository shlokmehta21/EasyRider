import { FC, useContext } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CustomButton } from "../components/common/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../context/UserContext";
import axios from "axios";

interface Settings {
  navigation: NativeStackNavigationProp<any, any>;
}

const Settings: FC<Settings> = ({ navigation }) => {
  const { setIsLogged, setUserSessionID, userSessionID } =
    useContext(UserContext);

  async function logOutUser() {
    try {
      const { data } = await axios.get("http://localhost:4000/logout", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          sessionid: userSessionID,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message);
        return error.message;
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  }

  const OnLogout = async () => {
    if (userSessionID) {
      try {
        logOutUser();

        const result = await AsyncStorage.removeItem("userSession");
        // @ts-ignore
        setIsLogged(false);
        // @ts-ignore
        setUserSessionID(null);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.settingCard}>
          <View style={styles.notification}>
            <Ionicons name="notifications" size={24} color="black" />
            <Text style={styles.text}>Notifications</Text>
          </View>
          <Switch />
        </View>

        <Pressable
          style={styles.settingCard}
          onPress={() => navigation.navigate("Account")}
        >
          <View style={styles.notification}>
            <MaterialCommunityIcons name="account" size={24} color="black" />
            <Text style={styles.text}>Update Profile</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </Pressable>

        <View style={styles.settingCard}>
          <View style={styles.notification}>
            <MaterialIcons name="accessibility" size={24} color="black" />
            <Text style={styles.text}>Accessibility</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>

        <View style={styles.settingCard}>
          <View style={styles.notification}>
            <Ionicons name="ios-settings-sharp" size={24} color="black" />
            <Text style={styles.text}>General</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>

        <View style={[styles.settingCard, styles.lastCard]}>
          <View style={styles.notification}>
            <Feather name="help-circle" size={24} color="black" />
            <Text style={styles.text}>Help</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>
        <CustomButton
          title="Logout"
          onPress={OnLogout}
          backGroundColor="#eb5d44"
          color="white"
        />
      </View>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F2",
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  settingCard: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 4,
    borderColor: "#c0c0c0",
    borderBottomWidth: 0.3,
  },
  notification: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontWeight: "400",
    marginLeft: 5,
  },
  lastCard: {
    marginBottom: 10,
  },
});
