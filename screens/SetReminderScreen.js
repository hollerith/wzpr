import React, { useState, useEffect, useContext } from "react"
import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-community/async-storage'
import { Picker } from '@react-native-community/picker'
import { ThemeContext } from "../contexts/ThemeProvider"
import { DataContext } from "../contexts/DataProvider"
import {
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid
} from 'react-native'

const displayDate = (d) => {
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`
}

const displayTime = (d) => {
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${z(d.getHours())}:${z(d.getMinutes())}`
}

const addMinutes = (date, minutes) => { return new Date(date.getTime() + minutes*60000); }

const SetReminderScreen = ({ route, navigation }) => {

  const { action, job } = route.params
  const { theme } = useContext(ThemeContext)
  const { contacts, sendSMS, jobs, setJobs, saveJob } = useContext(DataContext)

  const [state, setState] = useState({
    text: job ? job.text : "",
    schedule: job ? new Date(job.schedule) : addMinutes(new Date(), 5),
    repeat: job ? job.repeat : "once",
    showDatePicker: false,
    showTimePicker: false
  })

  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    validateForm();
  }, [state.text, state.schedule])

  const validateForm = () => {
    if (state.text.length > 0) {
      if (state.schedule > (new Date())) {
        setIsValid(true)
      } else {
        setIsValid(false)
      }
    } else {
      setIsValid(false)
    }
  };

  const onSave = async () => {
    const Job = { 
      id: job ? job.id : new Date().getTime().toString(), 
      text: state.text, 
      schedule: state.schedule, 
      repeat: state.repeat,
      action: action || job.action,
      disabled: false
    }

    saveJob(Job)
    navigation.push('Jobs')
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || state.schedule
    setState({...state, schedule: currentDate, showDatePicker: false})
  };

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || state.schedule
    setState({...state, schedule: currentDate, showTimePicker: false})
  };

  const getHandler = key => val => {
    setState({...state, [key]: val });
  };

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1,
      backgroundColor: theme.backgroundColor
    },
    textinput: {
      fontSize: 18,
      color: theme.textColor,
      borderWidth: 1,
      borderColor: theme.borderColor,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginVertical: 10,
      borderRadius: 3,
    },
    text: {
      color: theme.textColor,
      textAlign: "center"
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ padding: 20 }}>
        <TextInput
          style={[ styles.textinput, { 
            textAlign: "center", 
            fontSize: 18,
            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
          }]}
          value={state.text}
          onChangeText={getHandler('text')}
          placeholder="Enter message here"
          multiline = {true}
          numberOfLines = {5}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setState({...state, showDatePicker: true})}>
            <Text style={[styles.textinput, { fontSize: 24}]}>{displayDate(state.schedule)}</Text>
          </TouchableOpacity>        
          { state.showDatePicker ?
          <DateTimePicker
            testID="datePicker"
            value={state.schedule}
            mode='date'
            display="default"
            onChange={onChangeDate}
          /> : null }
          <TouchableOpacity onPress={() => setState({...state, showTimePicker: true})}>
            <Text style={[styles.textinput, { fontSize: 24}]}>{displayTime(state.schedule)}</Text>
          </TouchableOpacity>        
          { state.showTimePicker ?
          <DateTimePicker
            testID="timePicker"
            value={state.schedule}
            mode='time'
            is24Hour={true}
            display="spinner"
            onChange={onChangeTime}
          /> : null }
        </View>
        <View style={{ margin: 5 }}/>
        <View style={{ flexDirection: 'row', borderColor: theme.borderColor, borderWidth: 1}} >
          <Picker
            style={{ flex: 1, color: theme.textColor }}
            selectedValue={state.repeat}
            onValueChange={(itemValue, itemIndex) => setState({...state, repeat: itemValue})}>
            <Picker.Item label="Just once" value="once" />
            <Picker.Item label="Every 5 mins" value="5" />
            <Picker.Item label="Every 15 mins" value="15" />
            <Picker.Item label="Every 30 mins" value="30" />
            <Picker.Item label="Hourly" value="60" />
            <Picker.Item label="Daily" value="1440" />
            <Picker.Item label="Weekly" value="10080" />
            <Picker.Item label="Monthly" value="month" />
            <Picker.Item label="Quarterly" value="quarter" />
            <Picker.Item label="Annually" value="year" />
          </Picker>
        </View>
        <View style={{ margin: 5 }}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
          <Button
            title={ action == 'alert' ? "Set Reminder" : "Set alarm" }
            onPress={onSave}
            disabled={!isValid}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SetReminderScreen;
