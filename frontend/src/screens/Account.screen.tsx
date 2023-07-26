import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import CustomDatePicker from "../components/common/CustomDatePicker";
import * as ImagePicker from "expo-image-picker";
import AxiosInstance from "../Utils/AxiosConfig";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { QueryClient, useMutation, useQuery } from "react-query";
import { UserProfile } from "../types/UserProfile";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ValidationSchema = Yup.object().shape({
  DOB: Yup.date().required("Date of birth is Required"),
  Phone: Yup.number()
    .min(10, "Should 10 digits long")
    .required("Phone Number is Required"),
  Email: Yup.string().email("Invalid email").required("Email is Required"),
  Password: Yup.string()
    .required("Required")
    .min(6, "Must be 6 characters or more")
    .matches(/[a-z]+/, "One lowercase character")
    .matches(/[A-Z]+/, "One uppercase character")
    .matches(/[@$!%*#?&]+/, "One special character")
    .matches(/\d+/, "One number"),
  ConfirmPassword: Yup.string().oneOf(
    [Yup.ref("Password")],
    "Passwords must match"
  ),
  CollegeName: Yup.string().required("College Name is Required"),
  StartDate: Yup.string().required("Start Date is Required"),
  EndDate: Yup.string().required("End Date is Required"),
  StudentID: Yup.string().required("Student ID is Required"),
});

interface AccountProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const Account: React.FC<AccountProps> = ({ navigation }) => {
  const { userStorage } = useContext(UserContext);

  const userId = userStorage?.user.id;

  const [image, setImage] = useState({
    uri: "https://lh3.googleusercontent.com/ogw/AGvuzYaDDOysmiNBPMt5W3bVUnWmVaO-EYf9bZFuEMR-Qg=s32-c-mo",
  });

  const pickImage = async (
    setFieldValue: (valueString: string, data: {} | undefined) => void
  ) => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      const image = {
        fileSize: result?.assets[0].fileSize,
        base64: result?.assets[0].base64,
      };

      console.log(result?.assets[0].fileSize);
      setImage({ uri: result?.assets[0].uri });
      setFieldValue("ProfilePic", JSON.stringify(image));
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await AxiosInstance.post("/user", {
        id: userId,
      });

      return data;
    } catch (error) {
      console.log("GetUser error");
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data);
        }
      }
    }
  };

  const updateUser = async (values: UserProfile) => {
    try {
      const { data } = await AxiosInstance.put("/user/profile", values);
      return data;
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data);
        }
      }
    }
  };

  const { data, error, isLoading } = useQuery("UserData", getUserData);

  const {
    mutate,
    isLoading: isUpdating,
    isSuccess,
  } = useMutation(updateUser, {
    onSuccess: (data) => {
      navigation.navigate("Setting");
      console.log(data);
    },
    onError: () => {},
    onSettled: () => {},
  });

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            FirstName: isLoading ? "" : data?.firstName,
            LastName: isLoading ? "" : data?.lastName,
            DOB: isLoading ? "" : new Date(data?.dob).toDateString(),
            Email: isLoading ? "" : data?.email,
            Phone: isLoading ? "" : data?.phoneNumber,
            CollegeName: "",
            StartDate: "",
            EndDate: "",
            ProfilePic: {},
            StudentID: {} || null,
            License: {},
          }}
          // validationSchema={ValidationSchema}
          onSubmit={(values, { resetForm }) => {
            console.log(values);

            const data = {
              firstName: values.FirstName,
              lastName: values.LastName,
              email: values.Email,
              dob: new Date(values.DOB).getTime(),
              phoneNumber: String(values.Phone),
            };
            mutate(data);

            if (isSuccess) resetForm();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <View style={styles.container}>
              <Pressable onPress={() => pickImage(setFieldValue)}>
                <Image source={image} style={styles.profilePicture} />
              </Pressable>
              <CustomInput
                placeholder="First Name"
                secureTextEntry={false}
                value={values.FirstName}
                onTextChange={handleChange("FirstName")}
              />
              {/* {touched.FirstName && errors.FirstName && (
                <Text style={styles.errorMsg}>{errors.FirstName}</Text>
              )} */}
              <CustomInput
                placeholder="Last Name"
                secureTextEntry={false}
                value={values.LastName}
                onTextChange={handleChange("LastName")}
              />
              {/* {touched.LastName && errors.LastName && (
                <Text style={styles.errorMsg}>{errors.LastName}</Text>
              )} */}
              <CustomInput
                placeholder="Email"
                secureTextEntry={false}
                autoCapitalizeEmail="none"
                value={values.Email}
                onTextChange={handleChange("Email")}
              />
              {/* {touched.Email && errors.Email && (
                <Text style={styles.errorMsg}>{errors.Email}</Text>
              )} */}
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
                placeholder="Phone Number"
                secureTextEntry={false}
                value={values.Phone}
                keyboardType="number-pad"
                maxLength={10}
                onTextChange={handleChange("Phone")}
              />
              {/* {touched.Phone && errors.Phone && (
                <Text style={styles.errorMsg}>{errors.Phone}</Text>
              )} */}

              <CustomButton
                title="Update"
                children={isUpdating ? <ActivityIndicator /> : null}
                onPress={handleSubmit}
                backGroundColor="black"
                color="white"
                diabled={isUpdating ? true : false}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "flex-start",
    color: "grey",
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
  profilePicture: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    marginVertical: 20,
  },
});
