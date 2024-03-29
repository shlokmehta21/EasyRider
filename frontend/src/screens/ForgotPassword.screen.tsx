import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CustomInput } from "../components/common/CustomInput";
import { CustomButton } from "../components/common/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const ValidationSchema = Yup.object().shape({
  Email: Yup.string().email("Invalid email").required("Email is Required"),
});

export interface ForgotPassword {
  navigation: NativeStackNavigationProp<any, any>;
}

const ForgotPassword: React.FC<ForgotPassword> = ({ navigation }) => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  async function findUser(FindEmail: string) {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/forgot-password",
        { email: FindEmail },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const regex = /\/reset-password\/([^/]+)/;
          const match = regex.exec(error.response.data.error);
          const tokenwithText = match ? match[1] : null;
          setToken(tokenwithText?.split(" ")[0] as string);
        }
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  }

  const { mutate, isLoading } = useMutation(findUser, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries("create");
    },
  });

  useEffect(() => {
    if (token !== "") {
      navigation.navigate("ResetPassword", { token, email });
    }
  }, [token]);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Formik
        initialValues={{
          FindEmail: "",
        }}
        // validationSchema={ValidationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values);
          setEmail(values.FindEmail);
          mutate(values.FindEmail);
          // resetForm();
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <CustomInput
              placeholder="Email"
              secureTextEntry={false}
              value={values.FindEmail}
              onTextChange={handleChange("FindEmail")}
              autoCapitalizeEmail="none"
            />
            {touched.FindEmail && errors.FindEmail && (
              <Text style={styles.errorMsg}>{errors.FindEmail}</Text>
            )}

            <CustomButton
              title="Find Account"
              onPress={handleSubmit}
              children={isLoading ? <ActivityIndicator /> : null}
              backGroundColor="black"
              color="white"
            />

            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerText}>
                New to the App? <Text style={styles.btn}>Register.</Text>
              </Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
    color: "grey",
    marginBottom: 40,
  },
  errorMsg: {
    alignSelf: "flex-start",
    color: "rgb(255, 99, 71)",
    paddingBottom: 7,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 18,
  },
  btn: {
    fontWeight: "bold",
  },
});
