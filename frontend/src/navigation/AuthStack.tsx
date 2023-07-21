import React, { FC, memo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Welcome } from "../screens/Welcome.screen";
import Login from "../screens/Login.screen";
import Register from "../screens/Register.screen";
import ForgotPassword from "../screens/ForgotPassword.screen";
import Home from "../screens/Home.screen";
import ResetPassword from "../screens/ResetPassword.screen";

const Stack = createNativeStackNavigator();

const AuthStack: FC = memo(() => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
});

export default AuthStack;
