import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView, Image,
    KeyboardAvoidingView,TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import {base_url, putDataAsync} from '../constants/Base';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import { Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';
const ChildGrowthSchema = yup.object({
    AssessmentDate: yup.string().required(),
    Height: yup.number().required(),
    Weight: yup.number().required(),
    GeneralHealth: yup.string().required(),
    Comments: yup.string()
})

var date = new Date().getDate(); //Current Date
var month = new Date().getMonth() + 1; //Current Month
var year = new Date().getFullYear(); //Current Year

export default class ChildGrowth extends React.Component{
constructor(props){
super(props);
this.state ={
AssessmentOn:'',
showAD: false,
submitAlertMessage: '',
child: this.props.navigation.getParam('child'),
isVisible: false,
loading: false,
errorDisplay: false,
sucessDisplay: false
}
}
showAssessmentDatePicker = () => {
    this.setState({
      showAD: true
    });
  };

_pickAssessmentDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            AssessmentOn: a, showAD: false
        });
        handleChange(a);
    }

    submitChildGrowthForm(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "childNo": this.state.child.childNo,
                "healthDate":values.AssessmentDate,
                "height":values.Height,
                "weight":values.Weight,
                "generalHealth":values.GeneralHealth,
                "comments":values.Comments
        });
        let result = {};
        fetch(base_url+"/child-health", {
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
            this.setState({submitAlertMessage: 'Successfully added child growth details '});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add child growth details. Please contact the Admin.'});
            this.setState({ errorDisplay: true });
            console.log(error);
        });
    }

    render() {
        return (

            <View style={globalStyles.formcontainer}>
            <View style={globalStyles.backgroundlogoimageview}>
                <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
            </View>
                <Formik
                initialValues = {
                    {
                        AssessmentDate: this.state.AssessmentOn,
                        Height: '',
                        Weight: '',
                        GeneralHealth: '',
                        Comments: ''
//                        CreatedBy: 'admin',
//                        ModifiedBy: 'admin',
//                        CreatedDate: date + '/' + month + '/' + year,
//                        ModifiedDate: date + '/' + month + '/' + year,
                    }
                }
                validationSchema = {ChildGrowthSchema}
                onSubmit = {async (values, actions) => {
                    console.log(values);
                    this.setState({
                    AssessmentOn:''
                    });
                     this.submitChildGrowthForm(values);
                    actions.resetForm();

                }}
                >
   {props => (
               <ScrollView showsVerticalScrollIndicator = {false}>
               <View >
               <Text style = {globalStyles.label}>Assessment Date: <Text style={{ color: "red" }}>*</Text></Text>
                    <View style={globalStyles.dobView}>
                                             <TextInput
                                              style={globalStyles.inputText, globalStyles.dobValue}
                                              value={this.state.AssessmentOn}
                                              onValueChange={props.handleChange('AssessmentDate')}
                                              />
                                             <TouchableHighlight onPress={this.showAssessmentDatePicker}>
                                               <View>
                                               <Feather style={globalStyles.dobBtn} name="calendar" />
                                               </View>
                                               </TouchableHighlight>

                                                                                {this.state.showAD &&
                                                                                    <DateTimePicker
                                                                                        style={{ width: 100 }}
                                                                                        mode="date" //The enum of date, datetime and time
                                                                                        value={new Date()}
                                                                                        mode={'date'}
                                                                                        onChange={(e, date) => this._pickAssessmentDate(e, date, props.handleChange('AssessmentDate'))}
                                                                                        maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                                                                    />
                                                                                }
                    </View>
                    <Text style={globalStyles.errormsgform}>{props.touched.AssessmentDate && props.errors.AssessmentDate}</Text>

               <Text style = {globalStyles.label}>Height(Cm): <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput  style={globalStyles.inputText} keyboardType = 'numeric' value = {props.values.Height} onChangeText={props.handleChange("Height")} onBlur={props.handleBlur("Height")}></TextInput>
                    <Text style={globalStyles.errormsgform}>{props.touched.Height && props.errors.Height}</Text>

               <Text style = {globalStyles.label}>Weight(Kg): <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput style={globalStyles.inputText} keyboardType = 'numeric'  value = {props.values.Weight} onChangeText={props.handleChange("Weight")} onBlur={props.handleBlur("Weight")}></TextInput>
                    <Text style={globalStyles.errormsgform}>
                    {props.touched.Weight && props.errors.Weight}
                    </Text>

               <Text style = {globalStyles.label}>General Health: <Text style={{ color: "red" }}>*</Text></Text>
                   <Picker
                    selectedValue = {props.values.GeneralHealth}
                    onValueChange = {value => {
                                                props.setFieldValue('GeneralHealth', value)
                                               }}
                    style = {globalStyles.dropDown}
                    >
                       <Picker.Item color='grey' label="Select General Health" value="" />
                       {global.generalHealth.map((item) => {
                            return <Picker.Item key = {item.generalHealthID} label = {item.generalHealth} value = {item.generalHealthID}/>
                       })}
                    </Picker>
                    <Text style={globalStyles.errormsgform}>
                    {props.touched.GeneralHealth && props.errors.GeneralHealth}
                    </Text>
               <Text style = {globalStyles.label}>Comments:</Text>
                    <TextInput style={globalStyles.inputText} multiline={true} value = {props.values.Comments} onChangeText={props.handleChange("Comments")} onBlur={props.handleBlur("Comments")}></TextInput>
                    <Text style={globalStyles.errormsgform}>
                    {props.touched.Comments && props.errors.Comments}
                    </Text>
               <Button  title="Submit" onPress={props.handleSubmit} />
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
                  <SuccessDisplay successDisplay={this.state.successDisplay} type='Child growth Status' childNo={this.state.child.firstName} />
                  </View>
    </Modal>
    <LoadingDisplay loading={this.state.loading}/>
    </View>
    );
    }
}
