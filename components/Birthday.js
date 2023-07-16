import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

function Birthday() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = () => {
    // Handle saving the selected date
    console.log('Selected Date:', selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Birthday</Text>
      <View style={styles.datePickerContainer}>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Button
          title={selectedDate.toDateString()}
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
   top:12,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default Birthday;
