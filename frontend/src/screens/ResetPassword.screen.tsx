import { Formik } from "formik";
import { FC } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CustomInput } from "../components/common/CustomInput";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CustomButton } from "../components/common/CustomButton";
import { useMutation, useQueryClient } from "react-query";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import * as Yup from "yup";

const ValidationSchema = Yup.object().shape({
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
});

interface RestPassword {
  navigation: NativeStackNavigationProp<any, any>;
}

type UserRest = {
  password: string;
  confirmPassword: string;
};

const ResetPassword: FC<RestPassword> = ({ navigation }) => {
  const route = useRoute();
  const params = route.params;
  const queryClient = useQueryClient();

  async function resetPassword(obj: UserRest) {
    try {
      const { data } = await axios.post(
        // @ts-ignore
        `http://localhost:4000/reset-password/${params?.token}`,
        obj,
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
          console.log(error.response.data);
        }
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  }

  const { mutate, isLoading } = useMutation(resetPassword, {
    onSuccess: (data) => {
      console.log(data);
      navigation.navigate("Login");
    },
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries("create");
    },
  });

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          //@ts-ignore
          Email: params?.email as string,
          Password: "",
          ConfirmPassword: "",
        }}
        validationSchema={ValidationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values);
          const { Password, ConfirmPassword } = values;
          mutate({ password: Password, confirmPassword: ConfirmPassword });
          resetForm();
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <CustomInput
              placeholder="Email"
              secureTextEntry={false}
              value={values.Email}
              onTextChange={handleChange("Email")}
              autoCapitalizeEmail="none"
            />
            {touched.Email && errors.Email && (
              <Text style={styles.errorMsg}>{errors.Email}</Text>
            )}

            <>
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
            </>

            {touched.ConfirmPassword && errors.ConfirmPassword && (
              <Text style={styles.errorMsg}>{errors.ConfirmPassword}</Text>
            )}

            <CustomButton
              title="Rest Password"
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

export default ResetPassword;

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
