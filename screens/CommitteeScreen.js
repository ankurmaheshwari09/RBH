import React, { Component } from 'react';
import {  View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Formik } from "formik";
//import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { globalStyles } from "../styles/global";

export default class CommitteeScreen extends Component{

   constructor(props){
      super(props);
      this.handleText = this.handleText.bind(this);
      this.addDetails = this.addDetails.bind(this);
      this.pickDate = this.pickDate.bind(this);
      this.state = {
         show: false,
         date: null,
         suggestion: '',
         members : [
             {id:1 , value: "Staff Member 1", isChecked: false},
             {id:2 , value: "Staff Member 2", isChecked: false},
             {id:3 , value: "Staff Member 3", isChecked: false},
             {id:4 , value: "Staff Member 4", isChecked: false},
             {id:5 , value: "Staff Member 5", isChecked: false},
             {id:6 , value: "Staff Member 6", isChecked: false},
             {id:7 , value: "Staff Member 7", isChecked: false},
             {id:8 , value: "Staff Member 8", isChecked: false},
             {id:9 , value: "Staff Member 9", isChecked: false},
             {id:10 , value: "Staff Member 10", isChecked: false},
         ]
      };
    }
   handleText = (text) => {
      this.setState({ suggestion: text})
   }
   addDetails = (text, date , members) => {
      alert("Details added successfully")
     // this.props.navigation.push('CommitteeDisplay',text,date,members)

   }
   componentDidMount(){
      var that = this;
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year

      that.setState({
         //Setting the value of the date time
         date:
           date + '/' + month + '/' + year
    });
   }

   pickDate = (event, date, handleChange) => {
      console.log(date);
      let a = moment(date).format('DD/MM/YYYY');
      console.log(a);
      console.log(typeof (a));
      this.setState({ date: a, show: false });
      handleChange(a);
  }
   showDatepicker = () => {
   this.setState({ show: true });
   };

   
  
   render(){
    return(
      
      <Formik>
         {(props) => (
      <View style = {styles.container}>
          <TextInput style = {styles.input}
          underlineColorAndroid = "transparent"
          placeholder = "Enter suggestions given by committee members"
          placeholderTextColor = "#000000"
          onChangeText = {this.handleText}/>

          {
              this.state.members.map((member) => {
                <CheckBox style={styles.checkBoxStyle}
                onClick={()=>{
                    let tempMembers = [...this.state.members];
                    tempMembers[member.id-1].isChecked = !tempMembers[member.id-1].isChecked;
                   this.setState({
                      members: tempMembers
                   })
                   }}
                   isChecked={member.isChecked}     
                   rightText={member.value}               
                />   
              })
          }

           
            <Text style={styles.text}>Date:</Text>
            <View  style={globalStyles.dateView}>
               <TextInput
               style={globalStyles.inputText}            
               value={this.state.date}
               editable={false}
               onValueChange={props.handleChange('date')}
               />
               
               <TouchableHighlight onPress={this.showDatepicker}>
                  <View>
                     <Feather style={styles.dateBtn} name="calendar" />
                  </View>
               </TouchableHighlight>
               <Text style={styles.errormsg}>{props.touched.date && props.errors.date}</Text>
               {this.state.show &&
               <DateTimePicker
                  style={{ width: 200 }}
                  mode="date" //The enum of date, datetime and time
                  value={new Date()}
                  mode={'date'}
                  onChange={(e, date) => { this.pickDate(e, date, props.handleChange('date')) }}
               />
               }
            </View>
            
          <TouchableOpacity
             style = {styles.submitButton}
             onPress = {
                () => this.addDetails(this.state.suggestion, this.state.date ,this.state.members)
             }>
             <Text style = {styles.submitButtonText}> Submit </Text>
          </TouchableOpacity>
      </View>
      )}
      </Formik>
        
   )
}
}

const styles = StyleSheet.create({
container: {
   paddingTop: 50
},
dateBtn: {
   marginLeft: 4,
   flex: 2,
   fontSize: 35,
   marginTop: 4
},
input: {
   margin: 15,
   height: 150,
   borderColor: '#000000',
   borderWidth: 1,
   paddingLeft: 10
},
submitButton: {
   margin: 15,
   marginTop: 30,
   height: 40,
   paddingLeft: 150,
   paddingTop: 10,
   borderColor: '#000000',    
   borderWidth: 1
},
errormsg: {
    padding: 1,
    color: 'crimson',
    fontWeight: 'bold',
    fontSize: 10,
},
submitButtonText:{
   color: '#000000'
},
checkBoxStyle:{
   flex: 1, 
   flexDirection: 'column',
   paddingLeft: 20,
   marginLeft: 10,
   paddingBottom: 25
},
checkBoxText:{
   marginTop: 2,
   marginLeft: 30,
   paddingRight:240
},
text: {
   padding: 10,
   color: '#000000',
   fontSize: 17,
   fontWeight: 'bold',
   borderColor: '#000000'
},
dateView: {
   flex: 1,
   flexDirection: 'row',
},
dateValue: {
   borderWidth: 1,
   borderColor: '#ddd',
   padding: 10,
   marginBottom: 10,
   fontSize: 18,
   borderRadius: 6,
   flex: 3,
},
})