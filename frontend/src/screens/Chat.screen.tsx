import { FC } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CustomInput } from "../components/common/CustomInput";

interface Chat {}

const Chat: FC<Chat> = ({}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
      >
        <>
          <ScrollView contentContainerStyle={{ marginTop: 5 }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: "#ececec",
                flexDirection: "row",
                alignSelf: "flex-end",
                borderRadius: 10,
                margin: 5,
                marginBottom: 8,
                maxWidth: "80%",
                position: "relative",
              }}
            >
              <Text style={{ fontSize: 18, color: "#777777" }}>
                Hello, I need help regarding my account
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: "#4a70f7",
                flexDirection: "row",
                alignSelf: "flex-start",
                borderRadius: 10,
                margin: 5,
                marginBottom: 8,
                maxWidth: "80%",
                position: "relative",
              }}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>
                Hello There! I am Sarah. How can I help you?
              </Text>
            </View>
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 16,
              paddingVertical: 2,
            }}
          >
            <TextInput
              placeholder="type message"
              style={{
                bottom: 0,
                height: 40,
                flex: 1,
                marginRight: 10,
                backgroundColor: "#ececec",
                borderRadius: 10,
                paddingHorizontal: 10,
              }}
              textAlignVertical="top"
              // onSubmitEditing={sendMessage}
              // value={input}
              // onChangeText={(text) => setInput(text)}
            />
            <TouchableOpacity activeOpacity={0.5}>
              <Ionicons name="send" size={24} color="#2b68e6" />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
