import React, { Component } from 'react';
import { Alert, View, StyleSheet, Button, Text } from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { globalStyles } from '../styles/global';
import { generalInfoConstants } from '../constants/GeneralInfoConstants';
import { statusConstants } from '../constants/StatusConstants';
import { educationConstants } from '../constants/EducationConstants';
import {childConstants} from '../constants/ChildConstants';
import {SegmentedHealthView} from '../components/SegmentedHealthView';
import {
  createStackNavigator
} from 'react-navigation-stack';
import {HealthScreen} from '../screens/HealthScreen';


export default class HomeScreen extends Component {
displayHealthRemainder = () => {
    var month = new Date().getMonth() + 1; //Current Month
    var Ignore = 0;
    if((month == 1 || month == 4 || month == 7 || month == 10 ) && Ignore < 4){

        Alert.alert(
          'Health Assessment Remainder',
          ' Do the Health-Checkup',
          [
            {text: 'Ignore',onPress: () => {Ignore++;console.log('Ignore Pressed');}},
            {text: 'Update Later', onPress: () => console.log('UpdateLater Pressed')},
            {text: 'Update Now', onPress: () => this.props.navigation.navigate('HealthScreen')},
          ],
          {cancelable: false},
        );
      }
}

    componentDidMount() {
        childConstants()
        generalInfoConstants()
        statusConstants()
        educationConstants()
        this.displayHealthRemainder();
    }

    render() {
        return (
            <View style={globalStyles.homeView}>
                <Button style={globalStyles.addChildBtn} title='Add Child' onPress={() => this.props.navigation.navigate('AddChild',{navigation: this.props.navigation})}></Button>
                <View>
                    <Text style={globalStyles.homeScreenText}>Rainbow Homes Child Reporting Tool</Text>
                </View>
                <Button style={globalStyles.vuChildBtn} onPress={() => this.props.navigation.navigate('ViewChild')} title="View/Update Child"></Button>
            </View>

        );
    }
}
