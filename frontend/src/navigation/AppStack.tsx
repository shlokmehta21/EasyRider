import React, { FC, memo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Home from "../screens/Home.screen";
import Account from "../screens/Account.screen";
import Header from "../components/common/Header";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import Settings from "../screens/Settings.screen";
import AddCar from "../screens/AddCar.screen";
import Chat from "../screens/Chat.screen";
import AddRide from "../screens/AddRide.screen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TopTabs = createMaterialTopTabNavigator();

// Define Top Tabs Group
const TopTabsGroup = () => {
  return (
    <TopTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          height: 2.5,
          borderRadius: 5,
          backgroundColor: "#262829",
        },
      }}
    >
      <TopTabs.Screen name="Feed" component={Home} />
      <TopTabs.Screen name="Add a ride" component={AddRide} />
    </TopTabs.Navigator>
  );
};

// Define Home Stack Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TopTabsGroup}
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

// Define Settings Stack Navigator
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
      <Stack.Screen name="Help" component={Chat} options={{ title: "Help" }} />
    </Stack.Navigator>
  );
};

// Define Add Car Stack Navigator
const AddCarStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddCarScreen"
        component={AddCar}
        options={{
          header() {
            return <Header />;
          },
        }}
      />
    </Stack.Navigator>
  );
};

// Define App Tab Navigator
const AppStack: FC = memo(() => {
  const getTabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
    return routeName === "Help" ? "none" : "flex";
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "black" },
        tabBarInactiveTintColor: "grey",
        tabBarActiveTintColor: "black",
        tabBarHideOnKeyboard: Platform.OS === "ios" ? false : true,
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
        name="AddCar"
        component={AddCarStack}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
          },
          header(props) {
            return <Header />;
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-car-sport-sharp" size={size} color={color} />
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
});

export default AppStack;
