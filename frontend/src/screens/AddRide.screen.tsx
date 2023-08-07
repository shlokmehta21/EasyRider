import { Formik } from "formik";
import { FC, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { CustomInput } from "../components/common/CustomInput";
import CustomDatePicker from "../components/common/CustomDatePicker";
import { CustomButton } from "../components/common/CustomButton";
import PlacesAutoComplete from "../components/common/PlacesAutoComplete";
import AxiosInstance from "../Utils/AxiosConfig";
import axios from "axios";
import { useMutation, useQuery } from "react-query";

interface AddRideProps {}

const AddRide: FC<AddRideProps> = ({}) => {
  const [pickUpLocation, setPickUpLocation] = useState<
    [lat?: number, lon?: number]
  >([]);
  const [dropLocation, setDropLocation] = useState<
    [lat?: number, lon?: number]
  >([]);

  async function addRide(rideObject: any) {
    try {
      const { data } = await AxiosInstance.post("/ride/add", rideObject);
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

  const getCarData = async () => {
    try {
      const { data } = await AxiosInstance.get("/car");

      return data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data.error);
        }
      }
    }
  };

  const { data, error, isLoading } = useQuery("UserData", getCarData);

  const {
    mutate,
    isLoading: isUpdating,
    isSuccess,
  } = useMutation(addRide, {
    onSuccess: (data) => {
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
      style={{ flex: 1, flexDirection: "column", alignContent: "flex-start" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      > */}
      <Formik
        initialValues={{
          seatsAvailable: "",
          PickUpTime: "",
          DropTime: "",
        }}
        // validationSchema={ValidationSchema}
        onSubmit={(values, { resetForm }) => {
          const rideObj = {
            carId: data.id,
            noOfSeats: values.seatsAvailable,
            pickUp: {
              location: {
                coordinates: pickUpLocation,
              },
              time: new Date(values.PickUpTime),
            },
            dropOff: {
              location: {
                coordinates: dropLocation,
              },
              time: new Date(values.DropTime),
            },
          };

          mutate(rideObj);

          if (isSuccess === true) {
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
            <Text style={styles.title}>Add Ride</Text>
            <PlacesAutoComplete
              setStateLocation={setPickUpLocation}
              title="Pick Up Location"
              borderColor="#eaeaea"
              backgroundColor="#F9FBFC"
            />

            <CustomDatePicker
              fieldName="PickUpTime"
              value={values.PickUpTime}
              title="Pick Up Time"
              mode="datetime"
              setFieldValue={setFieldValue}
            />
            {touched.PickUpTime && errors.PickUpTime && (
              <Text style={styles.errorMsg}>{errors.PickUpTime}</Text>
            )}

            <PlacesAutoComplete
              setStateLocation={setDropLocation}
              title="Drop Location"
              borderColor="#eaeaea"
              margintop={3}
              backgroundColor="#F9FBFC"
            />

            <CustomDatePicker
              fieldName="DropTime"
              value={values.DropTime}
              title="Drop Time"
              mode="datetime"
              setFieldValue={setFieldValue}
            />
            {touched.DropTime && errors.DropTime && (
              <Text style={styles.errorMsg}>{errors.DropTime}</Text>
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

            <CustomButton
              title="Submit"
              children={isUpdating ? <ActivityIndicator /> : null}
              onPress={handleSubmit}
              backGroundColor="black"
              color="white"
              diabled={isUpdating ? true : false}
            />
          </View>
        )}
      </Formik>
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
};

export default AddRide;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 35,
    color: "grey",
    marginTop: 20,
    marginBottom: 20,
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
