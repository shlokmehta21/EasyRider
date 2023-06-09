import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomInput } from "../components/common/CustomInput";
import { CustomButton } from "../components/common/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomDatePicker from "../components/common/CustomDatePicker";
import { CustomImagePicker } from "../components/common/ImagePicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ValidationSchema = Yup.object().shape({
  FirstName: Yup.string().required("First Name is Required"),
  LastName: Yup.string().required("last Name is Required"),
  DOB: Yup.date().required("Date of birth is Required"),
  Phone: Yup.number()
    .min(10, "Should 10 digits long")
    .required("Phone Number is Required"),
  Email: Yup.string().email("Invalid email").required("Email is Required"),
  Password: Yup.string()
    .min(6, "Should be min of 6 characters")
    .max(16, "Should be max of 16 characters")
    .required("Password is required"),
  ConfirmPassword: Yup.string().oneOf(
    [Yup.ref("Password")],
    "Passwords must match"
  ),
  CollegeName: Yup.string().required("College Name is Required"),
  StartDate: Yup.string().required("Start Date is Required"),
  EndDate: Yup.string().required("End Date is Required"),
  StudentID: Yup.string().required("Student ID is Required"),
});

export interface LoginProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const Register: React.FC<LoginProps> = ({ navigation }) => {
  const [next, setNext] = useState(false);

  const loginButton = (
    <Pressable onPress={() => navigation.navigate("Login")}>
      <Text style={styles.loginText}>
        Already have a account with us?
        <Text style={styles.btnLogin}> Login.</Text>
      </Text>
    </Pressable>
  );

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Formik
        initialValues={{
          FirstName: "",
          LastName: "",
          DOB: "",
          Email: "",
          Phone: "",
          Password: "",
          ConfirmPassword: "",
          CollegeName: "",
          StartDate: "",
          EndDate: "",
          StudentID: "",
          License: "",
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
          setFieldValue,
        }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            {next === false ? (
              <>
                <CustomInput
                  placeholder="First Name"
                  secureTextEntry={false}
                  value={values.FirstName}
                  onTextChange={handleChange("FirstName")}
                />

                {touched.FirstName && errors.FirstName && (
                  <Text style={styles.errorMsg}>{errors.FirstName}</Text>
                )}

                <CustomInput
                  placeholder="Last Name"
                  secureTextEntry={false}
                  value={values.LastName}
                  onTextChange={handleChange("LastName")}
                />
                {touched.LastName && errors.LastName && (
                  <Text style={styles.errorMsg}>{errors.LastName}</Text>
                )}

                <CustomDatePicker
                  fieldName="DOB"
                  value={values.DOB}
                  title="Date of Birth"
                  setFieldValue={setFieldValue}
                />
                {touched.DOB && errors.DOB && (
                  <Text style={styles.errorMsg}>{errors.DOB}</Text>
                )}

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

                <CustomInput
                  placeholder="Password"
                  secureTextEntry={true}
                  value={values.Password}
                  onTextChange={handleChange("Password")}
                />

                {touched.Password && errors.Password && (
                  <Text style={styles.errorMsg}>{errors.Password}</Text>
                )}

                <CustomInput
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  value={values.ConfirmPassword}
                  onTextChange={handleChange("ConfirmPassword")}
                />

                {touched.ConfirmPassword && errors.ConfirmPassword && (
                  <Text style={styles.errorMsg}>{errors.ConfirmPassword}</Text>
                )}

                <CustomButton
                  title="Next"
                  onPress={() => setNext(true)}
                  backGroundColor="black"
                  color="white"
                />

                {loginButton}
              </>
            ) : (
              <>
                <CustomInput
                  placeholder="University / College Name"
                  secureTextEntry={false}
                  value={values.CollegeName}
                  onTextChange={handleChange("CollegeName")}
                />

                {touched.CollegeName && errors.CollegeName && (
                  <Text style={styles.errorMsg}>{errors.CollegeName}</Text>
                )}

                <CustomDatePicker
                  fieldName="StartDate"
                  value={values.StartDate}
                  title="Start Date"
                  setFieldValue={setFieldValue}
                />
                {touched.StartDate && errors.StartDate && (
                  <Text style={styles.errorMsg}>{errors.StartDate}</Text>
                )}

                <CustomDatePicker
                  fieldName="EndDate"
                  value={values.EndDate}
                  title="End Date"
                  setFieldValue={setFieldValue}
                />
                {touched.EndDate && errors.EndDate && (
                  <Text style={styles.errorMsg}>{errors.EndDate}</Text>
                )}

                <CustomImagePicker
                  title="Upload Student ID"
                  setFieldValue={setFieldValue}
                  fieldName="StudentID"
                />
                {touched.StudentID && errors.StudentID && (
                  <Text style={styles.errorMsg}>{errors.StudentID}</Text>
                )}

                <CustomImagePicker
                  title="Upload License (G2/G)"
                  setFieldValue={setFieldValue}
                  fieldName="License"
                />

                <Text style={styles.noteText}>
                  Optional step: upload the License (G2/G) only if you're going
                  to provide rides to other students. License can be uploaded in
                  account settings for future usage.
                </Text>

                <CustomButton
                  title="Go Back"
                  onPress={() => setNext(false)}
                  backGroundColor="#d2d2d4"
                  color="black"
                />

                <CustomButton
                  title="Register"
                  onPress={handleSubmit}
                  backGroundColor="black"
                  color="white"
                />
              </>
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Register;

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
  datepicker: {
    height: 120,
    marginTop: -20,
  },
  btnContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#ededed",
    padding: 10,
    width: "40%",
    borderRadius: 10,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "600",
  },
  loginText: {
    fontSize: 18,
  },
  btnLogin: {
    fontWeight: "bold",
  },
  noteText: {
    color: "#737373",
    width: "100%",
    marginBottom: 15,
  },
});
