import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, differenceInYears } from "date-fns";
import { updateDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";

function Birthday({ userId }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedDate) {
        return;
      }

      const userRef = doc(FIRESTORE_DB, "users", userId);

      const formattedDate = format(selectedDate, "MM/dd/yyyy");
      const age = differenceInYears(new Date(), selectedDate);

      await updateDoc(userRef, {
        birthday: formattedDate,
        age: age,
      });

      updateAge(age);

      console.log("Selected Date:", selectedDate);
      setShowDatePicker(false);
    } catch (error) {
      console.log("Error saving birthday:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Birthday</Text>
      <View style={styles.datePickerContainer}>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Button
          title={
            selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Select Date"
          }
          onPress={() => setShowDatePicker(!showDatePicker)}
          color="#007AFF"
        />
      </View>
      <Button title="Save" onPress={handleSave} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});

export default Birthday;
