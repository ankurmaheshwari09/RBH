import React, { Component } from 'react';
import { Alert, View, StyleSheet,Image, Button, Text,ActivityIndicator, } from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { globalStyles } from '../styles/global';
import { generalInfoConstants } from '../constants/GeneralInfoConstants';
import { statusConstants } from '../constants/StatusConstants';
import { educationConstants } from '../constants/EducationConstants';
import {childConstants} from '../constants/ChildConstants';
import {NotificationConstants} from '../constants/NotificationConstants';
import {SegmentedHealthView} from '../components/SegmentedHealthView';
import {
  createStackNavigator
} from 'react-navigation-stack';
import {HealthScreen} from '../screens/HealthScreen';

export default class HomeScreen extends Component {

displayHealthRemainder = () => {
    console.log('Health Ignore Value:'+ global.Ignore)
    if(global.Ignore == undefined){global.Ignore = 0}
    var month = new Date().getMonth() + 1; //Current Month
    var date = new Date().getDate();//current Date
    if((month == 1 || month == 4 || month == 7 || month == 10 ) && global.Ignore < 3){
        Alert.alert(
          'Health Assessment Remainder',
          ' Do the Health-Checkup',
          [
            {text: 'Ignore',onPress: () => {global.Ignore++;console.log('Ignore Pressed');}},
            {text: 'Update Later', onPress: () => console.log('UpdateLater Pressed')},
            {text: 'Update Now', onPress: () => this.props.navigation.navigate('ViewChild')},
          ],
          {cancelable: false},
        );
      }
}

    componentDidMount() {
        NotificationConstants()
        childConstants()
        generalInfoConstants()
        statusConstants()
        educationConstants()
        this.displayHealthRemainder();
    }

    render() {
        return (
            <View style={globalStyles.homeView}>
                {/* <Image source = {require("../assets/black.png")} style={{zIndex: -1, position: 'relative',}}/> */}
                <View style={globalStyles.backgroundlogoimageview}>
                    {/* <ActivityIndicator animating={true} size="large" color="red" /> */}
                    <Image source = {require("../assets/RBHsmall.png")} style={globalStyles.backgroundlogoimage}/>
                </View>
                <Button style={globalStyles.addChildBtn} title='Add Child' onPress={() => this.props.navigation.navigate('AddChild',{navigation: this.props.navigation})}></Button>
                <View>
                    <Text style={globalStyles.homeScreenText}>Rainbow Homes Child Reporting Tool</Text>
                </View>
                <Button style={globalStyles.vuChildBtn} onPress={() => this.props.navigation.navigate('ViewChild')} title="View/Update Child"></Button>
            </View>

        );
    }
}
