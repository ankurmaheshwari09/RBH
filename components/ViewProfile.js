import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView, Field,
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/samplestyles';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import CheckBox from 'react-native-check-box'
const ViewProfileSchema = yup.object({
    Description: yup.string().required(),
    // Date: yup.string().required(),
})

export default class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            showElements: false,
            showSSElements: false,
            submitAlertMessage: '',
        }
    }
    async addData(){
        getDataAsync(base_url + '/child-profile-description').then(data => {console.log(data); this.setState({date: data})});
        getDataAsync(base_url + '/child-profile-all-description/childNo').then(data => {console.log(data); this.setState({date: data})});
    }

    componentDidMount() {
        this.addData();
    }

    _submitProfile(values) {
        let request_body = JSON.stringify({
                "description": values.Suggestion,
                
        });
        // let result = {};
        fetch(base_url+"/child-profile-description", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully added suggestions given by committee '
            + 'Child No: '+responseJson.childNo + 'profileDescriptionNo '+responseJson.profileDescriptionNo});
            alert(this.state.submitAlertMessage);
            this.setState({date: null, showElements: false, showSSElements: false});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add Details. Plesae contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
            this.setState({date: null, showElements: false, showSSElements: false});
        });
    }

    _getProfile(){
        fetch(base_url+"/child-profile-description",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response)=>response.json)
        

    }

    render() {
        return (<View style={globalStyles.container1}>
            <View style={globalStyles.container}>
                <Formik
                    initialValues={
                        {
                            Description: '',
                          
                        }
                    }
                    validationSchema={ViewProfileSchema}
                    onSubmit={async (values, actions) => {
                        //actions.resetForm();
                        console.log(values);
                        this.setState({
                            showElements: false, showSSElements: false
                        });
                        let result = this._submitProfile(values);
                        let alertMessage = this.state.submitAlertMessage;
                        console.log(result);
                        alert(alertMessage);
                        this.props.navigation.push('CommitteeSuggestionForm', values)
                    }}
                >
        {props => (
            <KeyboardAvoidingView behavior="padding"
                enabled style={globalStyles.keyboardavoid}
                keyboardVerticalOffset={200}>
                <ScrollView>

                    <View>
                        <Text style={globalStyles.text}>Enter Description about child:</Text>
                        <Text style={globalStyles.errormsg}>{props.touched.Description && props.errors.Description}</Text>
                        <TextInput
                            style={globalStyles.input}
                            onChangeText={props.handleChange('Description')}
                            value={props.values.Description}
                        />

                         <Text style={globalStyles.padding}></Text>
                        <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

                                                        
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

                    )}

                </Formik>
            </View >
        </View >
        );
    }
}

















// import React, { Component } from 'react';
// import { Image, Button } from 'react-native';
// import {  Alert, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

// export default class ViewProfile extends Component {

//    constructor(props){
//       super(props)
//       this.state = {
//          description: ''
//       };
//     }
//    handleText = (text) => {
//       this.setState({ description: text})
//    }
//    addDetails = (text) => {
//       alert("Details added successfully \n" + text)
//       this.props.navigation.push('ProfileDisplay', {text})
//    }
   
//    _simpleAlertHandler=()=>{
//       //function to make simple alert
//       var date = new Date().getDate();
      
//       alert('Update Profile Description!');
//     }

//    render(){
//        return(
//           <View style = {styles.container}>
//              <Image
//                style={{marginLeft: 160, width: 70, height: 70, alignItems:'center', justifyContent:'center'}}
//                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
//              />
//              <TextInput style = {styles.input}
//              underlineColorAndroid = "transparent"
//              placeholder = "Add Child description briefly"
//              placeholderTextColor = "#000000"
//              onChangeText = {this.handleText}/>

//              <TouchableOpacity
//                 style = {styles.submitButton}
//                 onPress = {
//                    () => this.addDetails(this.state.description)
//                 }>
//                 <Text style = {styles.submitButtonText}> Submit </Text>    
//              </TouchableOpacity>
//              <Button style={{flex:1,alignItems:'right', justifyContent:'right'}}   
//               title='Update Profile?' onPress={this._simpleAlertHandler}/> 
//           </View>
// )
//    }
// }

// const styles = StyleSheet.create({
//    container: {
//       paddingTop: 50
//    },   
//    input: {
//       margin: 15,
//       height: 120,
//       paddingLeft: 90,
//       borderColor: '#000000',
//       borderWidth: 1
//    },
//    submitButton: {
//       margin: 15,
//       height: 40,
//       paddingLeft: 150,
//       paddingTop: 10,
//       borderColor: '#000000',    
//       borderWidth: 1
//    },
//    submitButtonText:{
//       color: '#000000'
//    }
// })

