import  React, { Component } from 'react';
import { Alert, View, StyleSheet, Button, Text} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import {globalStyles} from '../styles/global';
import {generalInfoConstants} from '../constants/GeneralInfoConstants';


export default class HomeScreen extends Component {

displayHealthRemainder = () => {
    var month = new Date().getMonth() + 1; //Current Month
    if(month == 1 || month == 3 || month == 7 || month == 10){
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

    componentDidMount(){
      generalInfoConstants()
    }

    render () {
        return (
            <View style={globalStyles.homeView}>
                <Button style={globalStyles.addChildBtn} title='Add Child' onPress = {() => this.props.navigation.navigate('AddChild')}></Button>
                <View>
                    <Text style={globalStyles.homeScreenText}>Rainbow Homes Child Reporting Tool</Text>
                </View>
                <Button style={globalStyles.vuChildBtn} onPress={() => this.props.navigation.navigate('ViewChild')} title="View/Update Child"></Button>
                <Button onPress ={this.displayHealthRemainder} title="Check Alerts"></Button>
            </View>

        );
    }
}
