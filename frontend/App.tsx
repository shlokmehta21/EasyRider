import React, { useContext } from "react";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./src/context/UserContext";
import AppNav from "./src/navigation/AppNav";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <SafeAreaView style={styles.safeArea}>
            <AppNav />
            <Toast
              position={"bottom"}
              visibilityTime={2000}
              autoHide={true}
              bottomOffset={Platform.OS === "ios" ? 80 : 40}
            />
          </SafeAreaView>
        </UserProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
});
