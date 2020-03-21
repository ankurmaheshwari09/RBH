import React, { Component } from 'react';
import AppNavigator from './navigation/AppNavigator';
import Login from './screens/Login';
// import {generalInfoConstants} from './statics/GeneralInfoGlobals';



export default class App extends Component {
    state = {
        isLoggedIn: false,
        username: "username",
        password: "password",
        message: "",
    }

    componentDidMount(){
        //generalInfoConstants()
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