import React, { Component } from 'react';
import { Alert, View, StyleSheet,Image, Button, Text,ActivityIndicator, RefreshControl} from 'react-native';
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
import {base_url, getDataAsync} from '../constants/Base';
import { getOrgId } from '../constants/LoginConstant';
import { Table, Row, Rows } from 'react-native-table-component';
import { FastField } from 'formik';
import { ScrollView } from 'react-native-gesture-handler';

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
          HeadTable: [],
          DataTable: [],
          tableBorder: false,
          showLoader: true,
          count: 0
        }
        this.t = setInterval(() => {
          this.setState({ count: this.state.count + 1 });
        }, 1000);
      }

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

    loadStats(){
        getDataAsync(base_url + '/dashboard/' + getOrgId())
            .then(data => {
                console.log(data);
                let stats = [] 
                for(let i = 0; i < data.length; i++){
                    stats.push([data[i].statusValue, data[i].total])
                }
                this.setState({HeadTable: ['Status', 'No. Of Children']})
                this.setState({DataTable: stats});
                this.setState({tableBorder: true, showLoader: false})
             })
    }
    
    componentDidMount() {
      const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', () => {
        this.setState({ count: 0 });
      });
        this.loadStats()
        NotificationConstants()
        childConstants()
        generalInfoConstants()
        statusConstants()
        educationConstants()
        this.displayHealthRemainder();
    }

    componentWillUnmount() {
      // Remove the event listener before removing the screen from the stack
      this.focusListener.remove();
      clearTimeout(this.t);
    }

    updateStats = (values) =>{
      this.setState({DataTable: values})
    }

    render() {
        const state = this.state;
        return (
            <View style = {globalStyles.container}>
                <View style = {{paddingTop: 15}}>
                    <View style={{ position: 'absolute', top:"45%",right: 0, left: 0 }}>
                        <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                    </View>
                    
                    <Table borderStyle={{borderWidth: this.state.tableBorder ? 1 : 0}}>
                        <Row data={state.HeadTable} style={styles.HeadStyle} textStyle={styles.TableText}/>
                        <Rows data={state.DataTable} textStyle={styles.TableText}/>
                    </Table>
                    
                </View>
                <View style={globalStyles.homeView}>
                    {/* <Image source = {require("../assets/black.png")} style={{zIndex: -1, position: 'relative',}}/> */}
                    <View style={globalStyles.backgroundlogoimageview}>
                        {/* <ActivityIndicator animating={true} size="large" color="red" /> */}
                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                    </View>
                
                    
                    <View>
                        <Text style={globalStyles.homeScreenText}>Rainbow Homes Child Reporting Tool</Text>
                    </View>
                    <View style = {{flexDirection: "row"}}>
                      <View style = {{padding: 20}}>
                      <Button style={globalStyles.addChildBtn} title='Add Child' onPress={() => this.props.navigation.navigate('AddChild',{navigation: this.props.navigation, updateStats: this.updateStats.bind(this)})}></Button>
                      </View>
                      <View style = {{padding: 20}}>
                      <Button style={globalStyles.vuChildBtn} onPress={() => this.props.navigation.navigate('ViewChild', {updateStats: this.updateStats.bind(this)})} title="View/Update Child"></Button>
                      </View>
                    </View>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: { 
      flex: 1,
      padding: 18,
      paddingTop: 35,
      backgroundColor: '#ffffff' 
    },
    HeadStyle: { 
      height: 50,
      alignContent: "center"
    },
    TableText: { 
      margin: 10
    }
  });