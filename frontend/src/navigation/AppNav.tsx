import React, { FC, useContext } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppNavProps {}

const AppNav: FC<AppNavProps> = ({}) => {
  const { user, userStorage } = useContext(UserContext);

  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  console.log(userStorage?.user?.sessionId);

  return (
    <NavigationContainer theme={AppTheme}>
      {userStorage?.user?.sessionId === undefined ? (
        <AuthStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default AppNav;
