import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Home from "../screens/Home.screen";
import { Foundation, Ionicons } from "@expo/vector-icons";
import Account from "../screens/Account.screen";
import Header from "../components/common/Header";
import { Platform } from "react-native";
import Settings from "../screens/Settings.screen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header() {
            return <Header />;
          },
        }}
      />
      {/* <Stack.Screen
        name="GameDetails"
        component={GameDetailsScreen}
        options={({ route }) => ({
          title: route.params?.title,
        })}
      /> */}
    </Stack.Navigator>
  );
};

const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={Settings}
        options={() => ({
          title: "Settings",
        })}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ title: "Update account" }}
      />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "black" },
        tabBarInactiveTintColor: "grey",
        tabBarActiveTintColor: "black",
        tabBarHideOnKeyboard: Platform.OS == "ios" ? false : true,
      }}
    >
      <Tab.Screen
        name="Home2"
        component={HomeStack}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
          },
          header(props) {
            return <Header />;
          },
          tabBarIcon: ({ color, size }) => (
            <Foundation name="home" size={size} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="Settings"
        component={SettingStack}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-settings-sharp" size={size} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const getTabBarVisibility = (route: any) => {
  // console.log(route);
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
  // console.log(routeName);

  if (routeName == "GameDetails") {
    return "none";
  }
  return "flex";
};

export default AppStack;
