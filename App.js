import React, { Component } from 'react';
import Login from './screens/Login';
import MainScreen from './screens/MainScreen';
import AppNavigator from './navigation/AppNavigator';
import { EventRegister } from 'react-native-event-listeners';


export default class App extends Component {
    state = {
        isLoggedIn: false,
        username: "username",
        password: "password",
        message: "",
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('logoutEvent', (data)=> {
            this.setState({isLoggedIn: false});
        });
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