import React, { FC, useContext } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

interface AppNavProps {}

const AppNav: FC<AppNavProps> = ({}) => {
  const { isLogged, user } = useContext(UserContext);
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  console.log("CONETXT", user?.sessionId === "");
  console.log("CONETXT", isLogged);
  return (
    <NavigationContainer theme={AppTheme}>
      {user?.sessionId !== "" ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;
