import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import device from "../constants/device";
import BottomSheet from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import PlacesAutoComplete from "../components/common/PlacesAutoComplete";

interface HomeProps {}

const Home: FC<HomeProps> = ({}) => {
  const [coordinates, setCoords] = useState<{
    lat: number | null;
    lon: number | null;
  }>({ lat: null, lon: null });
  const [showMap, setShowMap] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const getLocation = async () => {
      // get exisiting locaton permissions first
      const { status: existingStatus } =
        await Location.requestForegroundPermissionsAsync();
      let finalStatus = existingStatus;

      // ask again to grant locaton permissions (if not already allowed)
      if (existingStatus !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      // still not allowed to use location?
      if (finalStatus !== "granted") {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();

      setCoords({ lat: coords.latitude, lon: coords.longitude });
      setShowMap(true);
    };

    getLocation().catch(console.error);
  }, []);

  // variables
  const snapPoints = useMemo(() => ["20%", "25%", "60%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // open bottom sheet
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View style={styles.container}>
      {showMap && (
        <>
          {/* Search */}
          <PlacesAutoComplete
            onPress={handlePresentModalPress}
            borderColor="#ffffff"
            height={60}
            title="Where to?"
            paddingHorizontal={10}
          />

          <MapView
            followsUserLocation
            region={{
              latitude: coordinates.lat || 0,
              longitude: coordinates.lon || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            style={styles.map}
          />
        </>
      )}

      {!showMap && (
        <View style={styles.containerNoLocation}>
          <Text style={styles.textLocationNeeded}>
            We need your location data.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("app-settings:")}
            style={styles.btnGoTo}
          >
            <Text style={styles.btnGoToText}>Go to settings</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List of rides */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Ride List 🎉</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    flex: 1,
    height: device.height,
    position: "absolute",
    width: device.width,
    zIndex: -1,
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  search: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    borderWidth: 1,
    fontWeight: "700",
    borderRadius: 5,
    paddingVertical: Platform.OS === "ios" ? 20 : 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchBtn: {
    backgroundColor: "black",
    marginLeft: 10,
    marginBottom: 18,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  containerNoLocation: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: device.width,
  },
  textLocationNeeded: {
    fontSize: 20,
    marginBottom: 16,
  },
  btnGoTo: {
    backgroundColor: "black",
    borderRadius: 3,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  btnGoToText: {
    color: "white",
    fontSize: 16,
  },
});
