import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView, Image,
    KeyboardAvoidingView,Alert, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import {base_url} from '../constants/Base';
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import { Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';
import { getOrgId } from '../constants/LoginConstant';


const MultipleCampSchema = yup.object({

    campName: yup.string().required(),
    campnamedetails: yup.string().when('campName', {
                                is: 'Other',
                                then: yup.string()
                                    .required(),
                            }),
    hospitalName: yup.string().required(),
    hospitalnamedetails: yup.string()
          .when('hospitalName', {
                   is: 'Other',
                   then: yup.string()
                       .required(),
                 }),

    campDate: yup.string().required(),
    recommendations: yup.string().required()
})


export default class ChildMultipleCamps extends React.Component{
constructor(props){
super(props)
this.state ={
startDate: '',
showSD: false,
submitAlertMessage: '',
child: this.props.navigation.getParam('child'),
isVisible: false,
loading: false,
errorDisplay: false,
sucessDisplay: false
}
}

_pickStartDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            startDate: a, showSD: false
        });
        handleChange(a);
    }


showStartDatepicker = () => {
    this.setState({
      showSD: true
    });
  };

    submitMultipleCampsForm(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "campName": values.campName == 'Other' ? values.campnamedetails : values.campName,
                "hospitalName":values.hospitalName == 'Other' ? values.hospitalnamedetails : values.hospitalName,
                "childNo": this.state.child.childNo,
                "campDate": values.campDate,
                "recommendations": values.recommendations,
                "rhno": getOrgId()
        });
        let result = {};
        fetch(base_url+"/health-campDetails", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ successDisplay: true });
            this.setState({ loading: false, isVisible: true });
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully added child medical Camp details '});

        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add child child medical Camp details. Please contact the Admin.'});
            this.setState({ errorDisplay: true });
            console.log(error);
        });
    }
    render() {
        return (
            <View style = {globalStyles.formcontainer}>
            <View style={globalStyles.backgroundlogoimageview}>
                <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
            </View>
                <Formik
                initialValues = {
                    {
                       campName: this.state.startDate,
                       campnamedetails: '',
                       hospitalName:'',
                       hospitalnamedetails:'',
                       campDate:'',
                       recommendations:''


                    }
                }
                validationSchema = {MultipleCampSchema}
                onSubmit = {async (values, actions) => {

                    console.log(values);
                    this.setState({startDate:''});
                    this.submitMultipleCampsForm(values);
//                    console.log(result);
//                    alert("Data Has been submitted")
                    actions.resetForm();

                }}
                >
   { props => (
               <ScrollView showsVerticalScrollIndicator = {false}>
               <View>
                    <Text style={globalStyles.label}>Camp Date: <Text style={{ color: "red" }}>*</Text></Text>
                        <View style={globalStyles.dobView}>
                         <TextInput
                          style={globalStyles.inputform, globalStyles.dobValue}
                          value={this.state.startDate}
                          onValueChange={props.handleChange('campDate')}
                          />
                         <TouchableHighlight onPress={this.showStartDatepicker}>
                           <View>
                           <Feather style={globalStyles.dobBtn} name="calendar" />
                           </View>
                           </TouchableHighlight>
                                                            {this.state.showSD &&
                                                                <DateTimePicker
                                                                    style={{ width: 100 }}
                                                                    mode="date" //The enum of date, datetime and time
                                                                    value={new Date()}
                                                                    mode={'date'}
                                                                    onChange={(e, date) => this._pickStartDate(e, date, props.handleChange('campDate'))}
                                                                    maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                                                />
                                                            }

                         </View>
                         <Text style={globalStyles.errormsgform}> {props.touched.campDate && props.errors.campDate}</Text>

             {/*Camp Name*/}
                                    <Text style={globalStyles.label}>Camp Name: <Text style={{ color: "red" }}>*</Text> </Text>
                                    <Picker
                                        selectedValue={props.values.campName}
                                        style={globalStyles.dropDown}
                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('campName', itemValue)
                                            if (itemValue == 'Other') {
                                                this.setState({ showElementsCamp: true })
                                            } else {
                                                this.setState({ showElementsCamp: false })
                                            }
                                        }}
                                        value={props.values.campName}
                                    >
                                        <Picker.Item color='grey' label="Select Camp Name" value="" />
                                        {global.campName.map((item) => {
                                            return <Picker.Item key={item.rowNum} label={item.campName} value={item.campName} />
                                        })}
                                        <Picker.Item label="Add new Camp Name" value="Other" />
                                    </Picker>
                                    <Text style={globalStyles.errormsg}>{props.touched.campName && props.errors.campName}</Text>

                                    {/*Camp Nameto enter if other is selected*/}
                                    {this.state.showElementsCamp ?
                                        <View>
                                            <Text style={globalStyles.label}>Name: <Text style={{ color: "red" }}>*</Text> </Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                onChangeText={props.handleChange('campnamedetails')}
                                                value={props.values.campnamedetails}
                                            />
                                            < Text style={globalStyles.errormsg}>{props.touched.campnamedetails && props.errors.campnamedetails}</Text>

                                        </View> : null}

             {/*Hospital Name*/}
                                         <Text style={globalStyles.label}>Hospital Name: <Text style={{ color: "red" }}>*</Text> </Text>
                                         <Picker
                                             selectedValue={props.values.hospitalName}
                                             style={globalStyles.dropDown}
                                             onValueChange={(itemValue, itemIndex) => {
                                                 props.setFieldValue('hospitalName', itemValue)
                                                 if (itemValue == 'Other') {
                                                     this.setState({ showElementsHospital: true })
                                                 } else {
                                                     this.setState({ showElementsHospital: false })
                                                 }
                                             }}
                                             value={props.values.hospitalName}
                                         >
                                             <Picker.Item color='grey' label="Select Hospital Name" value="" />
                                             {global.hospitalName.map((item) => {
                                                 return <Picker.Item key={item.rowNum} label={item.hospitalName} value={item.hospitalName} />
                                             })}
                                             <Picker.Item label="Add new Hospital Name" value="Other" />
                                         </Picker>
                                         <Text style={globalStyles.errormsg}>{props.touched.hospitalName && props.errors.hospitalName}</Text>

                                         {/*Hospital Name to enter if other is selected*/}
                                         {this.state.showElementsHospital ?
                                             <View>
                                                 <Text style={globalStyles.label}>Name: <Text style={{ color: "red" }}>*</Text> </Text>
                                                 <TextInput
                                                     style={globalStyles.input}
                                                     onChangeText={props.handleChange('hospitalnamedetails')}
                                                     value={props.values.hospitalnamedetails}
                                                 />
                                                 < Text style={globalStyles.errormsg}>{props.touched.hospitalnamedetails && props.errors.hospitalnamedetails}</Text>

                                             </View> : null}

               <Text style={globalStyles.label}>Recommendations: <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput style={globalStyles.inputText} multiline ={true} value={props.values.recommendations} onChangeText ={props.handleChange("recommendations")} onBlur ={props.handleBlur("recommendations")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.recommendations && props.errors.recommendations}
                                        </Text>

               <Button title="Submit" onPress={props.handleSubmit} />
               </View>
               </ScrollView>
              )
   }
    </Formik>
    <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                             <View style={globalStyles.feedbackContainer}>
                                   <TouchableOpacity style={globalStyles.closeModalIcon} onPress={() => this.setState({ isVisible: false })}>
                                       <View>
                                           <Ionicons name="md-close" size={22}></Ionicons>
                                        </View>
                                   </TouchableOpacity>
                             <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                              <SuccessDisplay successDisplay={this.state.successDisplay} type='MedicalCamp Status' childNo={this.state.child.firstName} />
                              </View>
    </Modal>
     <LoadingDisplay loading={this.state.loading}/>
    </View>
    );
    }
}
