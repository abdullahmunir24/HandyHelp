import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import Birthday from "../components/Birthday";
import UploadImage from "../components/UploadImage";
import AdditionalInfo from "../components/AdditionalInfo";

const AdditionalInfoEmployer = () => {
  const [experience, setExperience] = useState("");
  const [username, setUsername] = useState("");
  const [info, setInfo] = useState("");
  const [salary, setSalary] = useState("");
  const [time, setTime] = useState("");
  const [work, setWork] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/ubc.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <AdditionalInfo
          text={experience}
          onChangeText={setExperience}
          title="How many years of experience do you have"
          placeholder="How long have you been working for"
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
          title="How much salary are you expecting per month"
          placeholder="Enter expected salary per month (Rupees)"
          editable={false}
        />

        <AdditionalInfo
          text={time}
          onChangeText={setTime}
          title="What time slot would you prefer"
          placeholder="Preferred timeslot(eg: 9am - 1pm)"
          editable={false}
        />

        <AdditionalInfo
          text={work}
          onChangeText={setWork}
          title="How many hours do you want to work"
          placeholder="Enter number of hours"
          editable={false}
        />

        <AdditionalInfo
          text={info}
          onChangeText={setInfo}
          title="Tell me about yourself and your past experiences"
          placeholder="Enter bio"
          editable={true}
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
