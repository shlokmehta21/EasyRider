import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomInput } from "../components/common/CustomInput";
import { CustomButton } from "../components/common/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ValidationSchema = Yup.object().shape({
  Email: Yup.string().email("Invalid email").required("Email is Required"),
  Password: Yup.string()
    .min(4, "Should be min of 4 characters")
    .max(16, "Should be max of 16 characters")
    .required("Password is required"),
});

export interface LoginProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Formik
        initialValues={{
          Email: "",
          Password: "",
        }}
        validationSchema={ValidationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values);
          resetForm();
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
          handleChange,
          handleSubmit,
        }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <CustomInput
              placeholder="Email"
              secureTextEntry={false}
              value={values.Email}
              onTextChange={handleChange("Email")}
            />
            {touched.Email && errors.Email && (
              <Text style={styles.errorMsg}>{errors.Email}</Text>
            )}
            <CustomInput
              placeholder="Password"
              secureTextEntry={true}
              value={values.Password}
              onTextChange={handleChange("Password")}
            />
            {touched.Password && errors.Password && (
              <Text style={styles.errorMsg}>{errors.Password}</Text>
            )}

            <Pressable
              style={{ alignSelf: "flex-end" }}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>

            <CustomButton
              title="Login"
              onPress={handleSubmit}
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

export default Login;

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
  forgot: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
