import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdditionalInfoEmployer from "./Views/AdditionalInfoEmployer";
import AdditionalInfoCustomer from "./Views/AdditionalInfoCustomer";
import Selection from "./Views/Selection";
import RegistrationView from "./Views/RegistrationView";
import LoginView from "./Views/LoginView";
import Account from "./Views/Account";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator initialRouteName="Registration">
        <Stack.Screen name="Registration" component={RegistrationView} />
        <Stack.Screen name="SignIn" component={LoginView} />
        <Stack.Screen name="Select" component={Selection} />
        <Stack.Screen name="Account" component={Account} />

        <Stack.Screen
          name="AdditionalCustomer"
          component={AdditionalInfoCustomer}
        />
        <Stack.Screen
          name="AdditionalEmployer"
          component={AdditionalInfoEmployer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
