import React, { FC } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import { Platform, StyleSheet, View } from "react-native";
import { color, set } from "react-native-reanimated";

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
  margintop?: number;
  fontweight?: string;
}

const PlacesAutoComplete: FC<PlacesAutoCompleteProps> = ({
  onPress,
  borderColor,
  height,
  title,
  paddingHorizontal,
  backgroundColor,
  setStateLocation,
  margintop,
  fontweight,
}) => {
  return (
    <View
      style={[
        styles.searchContainer,
        { paddingHorizontal: paddingHorizontal },
        { marginTop: margintop },
      ]}
    >
      <GooglePlacesAutocomplete
        styles={{
          textInputContainer: {},
          textInput: {
            width: "100%",
            backgroundColor: backgroundColor ? backgroundColor : "#ffffff",
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 5,
            fontWeight: fontweight ? fontweight : "600",
            fontSize: 14,
            height: height ? height : 50,
            marginBottom: 15,
          },
        }}
        isRowScrollable={true}
        GooglePlacesDetailsQuery={{ fields: "geometry" }}
        fetchDetails={true}
        textInputProps={{
          placeholderTextColor: "#7d7d7d",
        }}
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
