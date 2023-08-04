import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Button,
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
import { useMutation, useQuery } from "react-query";
import { UserProfile } from "../types/UserProfile";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { CustomImagePicker } from "../components/common/ImagePicker";

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
  const [uploadLicense, setUploadLicense] = useState(false);

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
            licenseNumber: isLoading ? "" : data.license?.number,
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
              license: {
                number: String(values.licenseNumber),
                images: values.License ? [values.License as Buffer] : [{}],
              },
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
              <Pressable
                style={styles.profilePictureContainer}
                onPress={() => pickImage(setFieldValue)}
              >
                <Image source={image} style={styles.profilePicture} />
                <View style={styles.editIcon}>
                  <MaterialCommunityIcons name="pencil" size={24} />
                </View>
              </Pressable>
              <CustomInput
                placeholder="First Name"
                secureTextEntry={false}
                value={values.FirstName}
                onTextChange={handleChange("FirstName")}
              />

              <CustomInput
                placeholder="Last Name"
                secureTextEntry={false}
                value={values.LastName}
                onTextChange={handleChange("LastName")}
              />

              <CustomInput
                placeholder="Email"
                secureTextEntry={false}
                autoCapitalizeEmail="none"
                value={values.Email}
                onTextChange={handleChange("Email")}
              />

              <CustomDatePicker
                fieldName="DOB"
                value={values.DOB}
                title="Date of Birth"
                setFieldValue={setFieldValue}
              />

              <CustomInput
                placeholder="Phone Number"
                secureTextEntry={false}
                value={values.Phone}
                keyboardType="number-pad"
                maxLength={10}
                onTextChange={handleChange("Phone")}
              />

              {data?.licence !== null ? (
                <>
                  <CustomInput
                    placeholder="Enter License Number"
                    secureTextEntry={false}
                    value={values.licenseNumber}
                    keyboardType="number-pad"
                    onTextChange={handleChange("licenseNumber")}
                  />

                  <CustomImagePicker
                    title="Update License (G2/G)"
                    setFieldValue={setFieldValue}
                    fieldName="License"
                  />
                </>
              ) : (
                <>
                  {uploadLicense ? (
                    <>
                      <CustomInput
                        placeholder="Enter License Number"
                        secureTextEntry={false}
                        value={values.licenseNumber}
                        keyboardType="number-pad"
                        onTextChange={handleChange("licenseNumber")}
                      />

                      <CustomImagePicker
                        title="Upload License (G2/G)"
                        setFieldValue={setFieldValue}
                        fieldName="License"
                      />
                    </>
                  ) : (
                    <View style={styles.licenseWarningContainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Feather name="info" size={24} color="#5068ff" />
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "#6d80fc",
                            marginLeft: 3,
                          }}
                        >
                          You haven't uploaded the license yet!
                        </Text>
                      </View>
                      {/* <Text
                        style={{
                          fontWeight: "500",
                          color: "#788aff",
                          marginTop: 10,
                          maxWidth: "92%",
                          marginBottom: 5,
                        }}
                      >
                        If you wish to provide ride on EasyRider please upload
                        your license.
                      </Text> */}

                      <Button
                        title="Upload"
                        onPress={() => setUploadLicense(true)}
                      />
                    </View>
                  )}
                </>
              )}

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
    marginTop: 5,
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
  profilePictureContainer: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    marginVertical: 20,
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  editIcon: {
    backgroundColor: "#fafafa",
    borderRadius: 100,
    padding: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  licenseWarningContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#acb7ff",
    backgroundColor: "#f2f4ff",
    borderRadius: 5,
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
