import React, { Component } from 'react';
import { Alert, View, StyleSheet, Button, Text } from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { globalStyles } from '../styles/global';
import { generalInfoConstants } from '../constants/GeneralInfoConstants';
import { statusConstants } from '../constants/StatusConstants';
import { educationConstants } from '../constants/EducationConstants';
import {childConstants} from '../constants/ChildConstants';
import { NotificationConstants } from '../constants/NotificationConstants';
import { EventRegister } from 'react-native-event-listeners';

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addChild: false,
        }
    }

displayHealthRemainder = () => {
    console.log('Health Ignore Value:'+ global.Ignore)
    if(global.Ignore == undefined){global.Ignore = 0}
    var month = new Date().getMonth() + 1; //Current Month
    var date = new Date().getDate();//current Date
    if((month == 1 || month == 4 || month == 7 || month == 10 ) && global.Ignore < 4){
        Alert.alert(
          'Health Assessment Remainder',
          ' Do the Health-Checkup',
          [
            {text: 'Ignore',onPress: () => {global.Ignore++;console.log('Ignore Pressed');}},
            {text: 'Update Later', onPress: () => console.log('UpdateLater Pressed')},
            {text: 'Update Now', onPress: () => this.props.navigation.navigate('SegmentedHealthView')},
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
     //   const navigationInfo = useNavigation();
      //  console.log(navigationInfo, 'pppppppppppp');
       /* this.listener2 = EventRegister.addEventListener('addSuccess', (data) => {
            console.log("child data event listener");
            alert("hello in list");
            this.setState({ addChild: true });
            *//*this.props.navigator.immediatlelyResetRouteStack([{
                component: StackNavigation
            }]);*//*
                                                                                                  
        });
        this.listener3 = EventRegister.addEventListener('addFailure', (data) => {
            console.log("child data event listener");
            alert("hello in list");
            this.setState({ addChild: false });
        });*/
    }
    componentWillUnmount() {
        //EventRegister.removeEventListener(this.listener)
    }

    render() {
        return (
            <View style={globalStyles.homeView}>
                <Button style={globalStyles.addChildBtn} title='Add Child' onPress={() => { this.props.screenProps.navigate('AddChild'), { navigation: this.props.screenProps } }}></Button>
                <View>
                    <Text style={globalStyles.homeScreenText}>Rainbow Homes Child Reporting Tool</Text>
                </View>
                <Button style={globalStyles.vuChildBtn} onPress={() => this.props.navigation.navigate('ChildList', { nav: this.state.addChild })} title="Update Child"></Button>
            </View>

        );
    }
}
