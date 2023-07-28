import { FC, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../context/UserContext";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const { userStorage } = useContext(UserContext);

  const image = {
    uri: "https://lh3.googleusercontent.com/ogw/AGvuzYaDDOysmiNBPMt5W3bVUnWmVaO-EYf9bZFuEMR-Qg=s32-c-mo",
  };
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          marginTop: 10,
          paddingBottom: 8,
          borderColor: "#a9a9a9",
          borderBottomWidth: 0.3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Hello, {userStorage?.user.firstName} {userStorage?.user.lastName}
        </Text>
        <TouchableOpacity
          style={{
            borderColor: "#e0e0e0",
            borderWidth: 1,
            borderRadius: 50,
          }}
        >
          <ImageBackground
            source={image}
            style={{ width: 35, height: 35 }}
            imageStyle={{ borderRadius: 25 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
