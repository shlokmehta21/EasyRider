import React, { useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./src/context/UserContext";
import AppNav from "./src/navigation/AppNav";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SafeAreaView style={styles.safeArea}>
          <AppNav />
        </SafeAreaView>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
});
