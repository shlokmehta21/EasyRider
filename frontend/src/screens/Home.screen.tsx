import { FC } from "react";
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface HomeProps {}

const Home: FC<HomeProps> = ({}) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Button group */}
        <View style={styles.btnGroupContainer}>
          <View style={[styles.buttonContainer, styles.active, styles.left]}>
            <TouchableOpacity>
              <Text style={[styles.btnText, styles.active]}>Book a ride</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonContainer, styles.right]}>
            <TouchableOpacity>
              <Text style={[styles.btnText]}>Add a ride</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search  */}
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search Location" style={styles.search} />
          <TouchableOpacity style={styles.searchBtn}>
            <FontAwesome name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* List of rides */}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  btnGroupContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "black",
    color: "white",
  },
  left: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  right: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  search: {
    flex: 1,
    backgroundColor: "#F9FBFC",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: Platform.OS === "ios" ? 15 : 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchBtn: {
    backgroundColor: "black",
    marginLeft: 10,
    marginBottom: 18,
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
});
