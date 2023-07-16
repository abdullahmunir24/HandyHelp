import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import Birthday from "../components/Birthday";
import UploadImage from "../components/UploadImage";
import AdditionalInfo from "../components/AdditionalInfo";

const AdditionalInfoEmployer = ({}) => {
  const [rooms, setRooms] = useState("");
  const [username, setUsername] = useState("");
  const [salary, setSalary] = useState("");
  const [time, setTime] = useState("");
  const [age, setAge] = useState("");
  const [family, setFamily] = useState("");
  const [other, setOther] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/ubc.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <AdditionalInfo
          text={rooms}
          onChangeText={setRooms}
          title="How many rooms do you wanted clean"
          placeholder="Number of rooms"
          editable={false}
        />

        <AdditionalInfo
          text={username}
          onChangeText={setUsername}
          title="Choose a username"
          placeholder="Enter a unique username"
          editable={false}
        />

        <AdditionalInfo
          text={salary}
          onChangeText={setSalary}
          title="How much salary are you willing to give"
          placeholder="Enter expected salary per month (Rupees)"
          editable={false}
        />

        <AdditionalInfo
          text={time}
          onChangeText={setTime}
          title="What time slot would you prefer"
          placeholder="Preferred timeslot"
          editable={false}
        />

        <AdditionalInfo
          text={age}
          onChangeText={setAge}
          title="What age would you prefer for the maids"
          placeholder="Enter preffered age"
          editable={false}
        />

        <AdditionalInfo
          text={other}
          onChangeText={setOther}
          title="Do you want to get utensils cleaned, and clothes washed and ironed or just rooms cleaned"
          placeholder="Enter answer"
          editable={false}
        />

        <AdditionalInfo
          text={family}
          onChangeText={setFamily}
          title="How many family members live in the house"
          placeholder="Number of Family Members"
          editable={false}
        />

        <UploadImage />
        <View style={styles.birth}>
          <Birthday />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 110,
    marginTop: 20,
    marginBottom: 40,
    top: 20,
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  birth: {
    marginBottom: 50,
  },
});

export default AdditionalInfoEmployer;
