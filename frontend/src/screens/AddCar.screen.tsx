import { Formik } from "formik";
import * as Yup from "yup";
import { FC } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CustomInput } from "../components/common/CustomInput";
import { CustomButton } from "../components/common/CustomButton";
import CustomDatePicker from "../components/common/CustomDatePicker";
import { useMutation, useQueryClient } from "react-query";
import AxiosInstance from "../Utils/AxiosConfig";
import axios from "axios";

const ValidationSchema = Yup.object().shape({
  purchasedOn: Yup.date().required("Date of birth is Required"),
  seatsAvailable: Yup.number()
    .min(1, "One seat should be available")
    .max(10, "Maximum 10 seats are available")
    .required("Seats are required is Required"),
  platNo: Yup.string().required("Plat Number is Required"),
  carType: Yup.string().required("Car Type is Required"),
  model: Yup.string().required("Model is Required"),
  name: Yup.string().required("Name is Required"),
});

interface AddCarProps {}

const AddCar: FC<AddCarProps> = ({}) => {
  const queryClient = useQueryClient();

  async function registerCar(carObject: any) {
    console.log(carObject);

    try {
      const { data } = await AxiosInstance.post("/car/register", carObject);

      return data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data.error);
        }
      }
    }
  }

  const { mutate, isLoading, status } = useMutation(registerCar, {
    onSuccess: (data) => {
      console.log(data);
      return data;
    },
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries("create");
    },
  });

  return (
    <KeyboardAvoidingView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={{
            name: "",
            carType: "",
            model: "",
            seatsAvailable: "",
            platNo: "",
            purchasedOn: "",
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values, { resetForm }) => {
            const carObject = {
              name: values.name,
              carType: values.carType,
              model: values.model,
              seatsAvailable: Number(values.seatsAvailable),
              plateNo: values.platNo,
              purchasedOn: new Date(values.purchasedOn).getTime(),
            };
            mutate(carObject);
            if (status === "success") {
              resetForm();
            }
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
              <Text style={styles.title}>Register Your Car</Text>
              <CustomInput
                placeholder="Name"
                secureTextEntry={false}
                value={values.name}
                onTextChange={handleChange("name")}
                autoCapitalizeEmail="none"
              />
              {touched.name && errors.name && (
                <Text style={styles.errorMsg}>{errors.name}</Text>
              )}
              <CustomInput
                placeholder="Car Type"
                secureTextEntry={false}
                value={values.carType}
                onTextChange={handleChange("carType")}
              />
              {touched.carType && errors.carType && (
                <Text style={styles.errorMsg}>{errors.carType}</Text>
              )}

              <CustomInput
                placeholder="Model"
                secureTextEntry={false}
                value={values.model}
                onTextChange={handleChange("model")}
              />
              {touched.model && errors.model && (
                <Text style={styles.errorMsg}>{errors.model}</Text>
              )}

              <CustomInput
                placeholder="Seats Available"
                secureTextEntry={false}
                value={values.seatsAvailable}
                keyboardType="number-pad"
                onTextChange={handleChange("seatsAvailable")}
              />
              {touched.seatsAvailable && errors.seatsAvailable && (
                <Text style={styles.errorMsg}>{errors.seatsAvailable}</Text>
              )}

              <CustomInput
                placeholder="Plat Number"
                secureTextEntry={false}
                value={values.platNo}
                onTextChange={handleChange("platNo")}
              />
              {touched.platNo && errors.platNo && (
                <Text style={styles.errorMsg}>{errors.platNo}</Text>
              )}

              <CustomDatePicker
                fieldName="purchasedOn"
                value={values.purchasedOn}
                title="Purchased On"
                setFieldValue={setFieldValue}
              />
              {touched.purchasedOn && errors.purchasedOn && (
                <Text style={styles.errorMsg}>{errors.purchasedOn}</Text>
              )}

              <CustomButton
                title="Submit"
                children={isLoading ? <ActivityIndicator /> : null}
                onPress={handleSubmit}
                backGroundColor="black"
                color="white"
                diabled={isLoading ? true : false}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddCar;

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
    fontSize: 40,
    color: "grey",
    marginBottom: 15,
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
