import React, { useState, useEffect, useContext } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';
import { ThemeContext } from "../contexts/ThemeProvider";
import { DataContext } from "../contexts/DataProvider";
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
} from 'react-native';

const displayDate = (d) => {
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`
}

const displayTime = (d) => {
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${z(d.getHours())}:${z(d.getMinutes())}`
}

const addMinutes = (date, minutes) => { return new Date(date.getTime() + minutes*60000); }

const SendMessageScreen = ({ route, navigation }) => {

  const { id, name, phone, checked } = route.params
  const { theme } = useContext(ThemeContext)
  const { contacts, sendSMS } = useContext(DataContext)

  const [state, setState] = useState({
    to: phone ? phone : contacts.filter(i => i.checked ).map(i => i.phone),
    text: "",
    schedule: addMinutes(new Date(), 5),
    repeat: "once",
    isNowValid: false,
    isLaterValid: false,
    showDatePicker: false,
    showTimePicker: false
  })

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS).then(() => {
      validateForm();
    })
  }, [state.text, state.schedule])

  const validateForm = () => {

    if (state.text.length > 0) {
      if (state.schedule > (new Date())) {
        setState({...state, isNowValid: true, isLaterValid: true })
      } else {
        setState({...state, isNowValid: true, isLaterValid: false })
      }
    } else {
      setState({...state, isNowValid: false, isLaterValid: false })
    }

    return (state.isNowValid || state.isLaterValid)
  };

  const onNow = () => {
    sendSMS(state.to, state.text)
    navigation.navigate('ContactList')
  };

  const onLater = async () => {

    const newJob = { 
      id: new Date().getTime().toString(), 
      to: state.to, 
      text: state.text, 
      schedule: state.schedule, 
      repeat: state.repeat,
      disabled: false
    }

    console.log(`\x1b[1m\x1b[33mSend SMS\x1b[31m\x1b[1m * \x1b[0m\x1b[34m${state.schedule}\x1b[0m`)

    const jobs = JSON.parse(await AsyncStorage.getItem('@wzpr:Jobs')) || []
    jobs.push(newJob)
    await AsyncStorage.setItem('@wzpr:Jobs', JSON.stringify(jobs))
    navigation.navigate('ContactList')
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
        <Text style={styles.textinput}>{state.to.toString()}</Text>
        <TextInput
          style={[ styles.textinput, { textAlign: "center", fontSize: 18 }]}
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
            style={{ color: theme.selectedColor }}
            title="Send Now"
            onPress={onNow}
            disabled={!state.isNowValid}
          />
          <Button
            style={{ color: 'purple' }}
            title="Send Later"
            onPress={onLater}
            disabled={!state.isLaterValid}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SendMessageScreen;
