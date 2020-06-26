import React, { useState, useEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Alert, Button, Image, StatusBar, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AddContactScreen from "./AddContactScreen";
import ContactListScreen from "./ContactListScreen";
import ContactDetailsScreen from "./ContactDetailsScreen";
import SendMessageScreen from "./SendMessageScreen";

import { LogoTitle, SplashScreen, Masthead } from "../components"
import { UserContext } from "../contexts/UserProvider"
import { DataContext } from "../contexts/DataProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

import { 
  HeaderButtons, 
  HeaderButton, 
  Item, 
  HiddenItem, 
  OverflowMenu, 
  OverflowMenuProvider 
} from 'react-navigation-header-buttons';

const HomeStack = createStackNavigator();

export default function HomeScreen({ navigation }) {

  const { theme } = useContext(ThemeContext)
  const { menu } = useContext(UserContext);

  const { 
    contacts,
    selected,
    buncoSquad, 
    reloadContacts,
    deleteContacts, 
    syncData, 
    loadData, 
    sendSMS, 
    smsContacts, 
    msgContact 
  } = useContext(DataContext);

  const scheduleSMS = () => { 
    if (selected().length > 0) {
      navigation.push("SendMessage", selected())
    } else {
      Alert.alert('Select some contacts to message')
    }
  }

  return (
    <HomeStack.Navigator
      style={{ backgroundColor: "green"}}
      screenOptions={{
        headerShown: true,
        headerTitle: props => <LogoTitle {...props} />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.headerBackgroundColor,
        },
        headerTintColor: theme.headerTintColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={Masthead}>
            <Item title="Add" iconName="plus" onPress={() => navigation.push("AddContact")} />
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="account" size={32} color={theme.iconColor} />}
            >
              <HiddenItem title="Add" onPress={() => navigation.push("AddContact") }/>
              <HiddenItem title="Delete" onPress={deleteContacts} />
              <HiddenItem title="Load" onPress={loadData} />
              <HiddenItem title="Sync" onPress={syncData} />
              <HiddenItem title="Wipe" onPress={() => { buncoSquad(); menu.signOut() }} />
            </OverflowMenu>
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color={theme.iconColor} />}
            >
              <HiddenItem title="Text" onPress={smsContacts} />
              { selected().length > 0 ? 
                <>
                <HiddenItem title="Schedule" onPress={scheduleSMS}/>
                <HiddenItem title="Clear" onPress={reloadContacts} />
                <HiddenItem title="Share" onPress={msgContact} /> 
                </> :
                <>       
                <HiddenItem title="Schedule" onPress={scheduleSMS} disabled/>
                <HiddenItem title="Clear" onPress={reloadContacts} disabled />
                <HiddenItem title="Share" onPress={msgContact} disabled /> 
                </> }
              <HiddenItem title="Sign Out" onPress={menu.signOut} />
            </OverflowMenu>
          </HeaderButtons>
        ),
      }} 
    >
      <HomeStack.Screen name="ContactList" component={ContactListScreen} options={{title: 'Home'}}  />
      <HomeStack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{title: 'Contacts'}} />
      <HomeStack.Screen name="AddContact" component={AddContactScreen} options={{title: 'Add Contact'}} />
      <HomeStack.Screen name="SendMessage" component={SendMessageScreen} options={{title: 'Send SMS'}} />
    </HomeStack.Navigator>
  );
}
