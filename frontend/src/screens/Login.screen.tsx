import React, { useContext } from "react";
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
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../context/UserContext";

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

interface LoginUserResponse {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  license?: {
    images?: [];
    number?: string;
  };
  phoneNumber?: string;
  sessionId?: string;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { setUser, setIsLogged, user } = useContext(UserContext);

  async function loginUser(userObject: LoginUserResponse) {
    try {
      const { data, headers } = await axios.post<LoginUserResponse>(
        "http://localhost:4000/login",
        userObject,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(headers.sessionid);

      const userObj = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        license: data.license,
        phone: data.phoneNumber,
        sessionId: headers.sessionid,
      };

      // @ts-ignore
      setUser(userObj);
      // @ts-ignore
      setIsLogged(true);

      return data;
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message);
        return error.message;
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  }

  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries("create");
    },
  });

  console.log("USER", user);

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
          const userObject = {
            email: values.Email,
            password: values.Password,
          };
          mutate(userObject);
          resetForm();
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
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
              children={isLoading ? <ActivityIndicator /> : null}
              onPress={handleSubmit}
              backGroundColor="black"
              color="white"
              diabled={isLoading ? true : false}
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
