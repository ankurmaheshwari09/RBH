import React, { Component } from 'react';
import { Alert, View, StyleSheet, Button, Text } from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { globalStyles } from '../styles/global';
import { generalInfoConstants } from '../constants/GeneralInfoConstants';
import { statusConstants } from '../constants/StatusConstants';
import { educationConstants } from '../constants/EducationConstants';
import {childConstants} from '../constants/ChildConstants';


export default class HomeScreen extends Component {

displayHealthRemainder = () => {
    var month = new Date().getMonth() + 1; //Current Month
    if(month == 1 || month == 4 || month == 7 || month == 10){
        Alert.alert(
          'Health Assessment Remainder',
          ' Do the Health-Checkup',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
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
