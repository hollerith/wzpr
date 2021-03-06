import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, ScrollView, StyleSheet, View, Text, TextInput } from "react-native";

import { LogoTitle, SplashScreen, Masthead } from "../components"

import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ThemeContext } from "../contexts/ThemeProvider"
import { UserContext } from "../contexts/UserProvider"

export default function LoginScreen({route, navigation}) {

  const { theme } = useContext(ThemeContext)
  const { user, menu } = useContext(UserContext)

  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState('')

  const onPress = () => {
    menu.setIsLoading()
    menu.signIn({ username, password });
  }

  const isSignout = user.isSignout;

  const styles = StyleSheet.create({
    banner: {
      fontSize: 48, 
      fontFamily: theme.bannerFontFamily,
      textAlign: "center",
      color: theme.bannerColor
    },
    textinput: {
      fontSize: 24, 
      borderWidth: 1,
      borderColor: theme.borderColor,
      minWidth: 100,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 3,
    },
    password: {
      marginTop: 10,
      marginVertical: 50,
    }
  });

  navigation.setOptions({ 
    title: '',
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
        <OverflowMenu
          style={{ marginHorizontal: 10 }}
          OverflowIcon={<Icon name="menu" size={32} color={theme.iconColor} />}
        >
          <HiddenItem title="About" onPress={() => {
            Alert.alert("wzpr Version 0.01", "Simple Secret Contacts app with timed SMS and fast wipe")
          }}/>
        </OverflowMenu>
      </HeaderButtons>
    ),
    animationTypeForReplace: { isSignout } ? 'pop' : 'push',
  })

  return (
    <ScrollView style={{padding: 20, color: theme.backgroundColor}}>
      <Text 
          style={ styles.banner }>
          Welcome
      </Text>
      <View style={{margin:20}} />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={ styles.textinput }
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.textinput , styles.password ]}
      />
      <Button title="Sign in" onPress={ onPress } />
    </ScrollView>
  );
}
