import React, { FC, useContext } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppNavProps {}

const getSessionID = async (): Promise<string | null> => {
  try {
    const result = await AsyncStorage.getItem("userSession");
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

const AppNav: FC<AppNavProps> = ({}) => {
  const { isLogged, user, userSessionID } = useContext(UserContext);
  // const [sessionID, setSessionID] = React.useState<string | null>("");
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  // React.useEffect(() => {
  //   getSessionID().then((res) => {
  //     if (res) {
  //       setSessionID(res);
  //     }
  //   });
  // }, [user]);

  console.log("CONETXT - User session empty", user?.sessionId === "");
  console.log("CONETXT", isLogged);
  console.log("STORAGE", userSessionID);

  return (
    <NavigationContainer theme={AppTheme}>
      {userSessionID === null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default AppNav;
