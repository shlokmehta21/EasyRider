import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomInput } from "../components/common/CustomInput";
import { CustomButton } from "../components/common/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ValidationSchema = Yup.object().shape({
  Email: Yup.string().email("Invalid email").required("Email is Required"),
  Phone: Yup.number()
    .min(10, "Should 10 digits long")
    .required("Phone Number is Required"),
});

export interface ForgotPassword {
  navigation: NativeStackNavigationProp<any, any>;
}

const ForgotPassword: React.FC<ForgotPassword> = ({ navigation }) => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Formik
        initialValues={{
          Email: "",
          Phone: "",
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
            <Text style={styles.title}>Reset Password</Text>
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
              placeholder="Phone Number"
              secureTextEntry={false}
              value={values.Phone}
              keyboardType="number-pad"
              maxLength={10}
              onTextChange={handleChange("Phone")}
            />
            {touched.Phone && errors.Phone && (
              <Text style={styles.errorMsg}>{errors.Phone}</Text>
            )}

            <CustomButton
              title="Continue"
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
