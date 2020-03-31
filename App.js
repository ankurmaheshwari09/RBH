import React, { Component } from 'react';
import AppNavigator from './navigation/AppNavigator';
import Login from './screens/Login';



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
                <AppNavigator/>
            )
        }
        else {
            return (
                <Login onLoginPress={() => this.setState({isLoggedIn: true})} />
            )
        }
    }
}