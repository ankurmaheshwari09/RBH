import React, { Component } from 'react';
import Login from './screens/Login';
import MainScreen from './screens/MainScreen';
import AppNavigator from './navigation/AppNavigator';



export default class App extends Component {
    state = {
        isLoggedIn: false,
        username: "username",
        password: "password",
        message: "",
    }

    render ()  {
        if (this.state.isLoggedIn == true) {
            return (
                <AppNavigator />
            )
        }
        else {
            return (
                <Login onLoginPress={() => {this.setState({isLoggedIn: true}); console.log("app.js");}} />
            )
        }
    }
}