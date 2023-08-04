import React, { FC } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import { Platform, StyleSheet, View } from "react-native";
import { set } from "react-native-reanimated";

interface PlacesAutoCompleteProps {
  onPress?: () => void;
  height?: number;
  borderColor?: string;
  title?: string;
  paddingHorizontal?: number;
  backgroundColor?: string;
  setStateLocation?: React.Dispatch<
    React.SetStateAction<[lat?: number, lon?: number]>
  >;
}

const PlacesAutoComplete: FC<PlacesAutoCompleteProps> = ({
  onPress,
  borderColor,
  height,
  title,
  paddingHorizontal,
  backgroundColor,
  setStateLocation,
}) => {
  return (
    <View
      style={[styles.searchContainer, { paddingHorizontal: paddingHorizontal }]}
    >
      <GooglePlacesAutocomplete
        styles={{
          textInputContainer: {},
          textInput: {
            width: "100%",
            backgroundColor: backgroundColor ? backgroundColor : "#ffffff",
            borderColor: borderColor,
            borderWidth: 1,
            color: "#5d5d5d",
            fontWeight: "700",
            borderRadius: 5,
            height: height ? height : 50,
            // paddingVertical: Platform.OS === "ios" ? 20 : 15,
            // paddingHorizontal: 15,
            marginBottom: 15,
          },
        }}
        GooglePlacesDetailsQuery={{ fields: "geometry" }}
        fetchDetails={true} // you need this to fetch the details object onPress
        placeholder={title ? title : "Search"}
        query={{
          key: REACT_APP_GOOGLE_API_KEY,
          language: "en",
        }}
        onPress={(data, details = null) => {
          console.log(JSON.stringify(details?.geometry?.location));
          // @ts-ignore
          onPress && onPress();

          setStateLocation &&
            setStateLocation([
              details?.geometry?.location?.lat,
              details?.geometry?.location?.lng,
            ]);
        }}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
      />
    </View>
  );
};

export default PlacesAutoComplete;

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
