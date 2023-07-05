import DatePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomInput } from "./CustomInput";

type CustomDatePickerProps = {
  fieldName: string;
  value: string;
  title: string;
  setFieldValue: (valueString: string, dateString: string | undefined) => void;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  title,
  setFieldValue,
  fieldName,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState(false);

  const showDatepicker = () => {
    setShow(true);
  };
  return (
    <>
      {!show && (
        <Pressable style={{ width: "100%" }} onPress={showDatepicker}>
          <CustomInput
            placeholder={title}
            secureTextEntry={false}
            value={value}
            editable={false}
            onTextChange={() => {}}
            onPressIn={showDatepicker}
          />
        </Pressable>
      )}
      {show && (
        <>
          <DatePicker
            style={styles.datepicker}
            testID="dateTimePicker"
            display="spinner"
            value={value !== "" ? new Date(value) : date}
            mode={"date"}
            is24Hour={true}
            onChange={(
              event: DateTimePickerEvent,
              selectedDate?: Date | undefined
            ) => {
              const currentDate = selectedDate;
              console.log(currentDate);
              if (Platform.OS === "android") {
                setShow(false);
              }
              setFieldValue(fieldName, currentDate?.toDateString());
            }}
          />

          {show && Platform.OS === "ios" && (
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setShow(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => setShow(false)}
              >
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default CustomDatePicker;
