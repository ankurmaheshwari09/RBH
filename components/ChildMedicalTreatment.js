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


const MedicalTreatmentSchema = yup.object({
    IllnessStartDate: yup.string().required(),
    VisitedDate: yup.string().required(),
    HospitalName: yup.string().required(),
    DoctorName: yup.string().required(),
    DiseasesDiagnosed: yup.string().required(),
    FurtherTests: yup.string(),
    TotalMedicalCost: yup.number().required(),
    Remarks: yup.string()
})


export default class ChildMedicalTreatment extends React.Component{
constructor(props){
super(props)
this.state ={
startDate: '',
visitDate: '',
showSD: false,
showVD: false,
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

_pickVisitedDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            visitDate: a, showVD: false
        });
        handleChange(a);
    }



showStartDatepicker = () => {
    this.setState({
      showSD: true
    });
  };

showVisitedDatepicker = () => {
    this.setState({
      showVD: true
    });
  };


    submitMedicalTreatmentForm(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "childNo": this.state.child.childNo,
                "illnessStartDate": values.IllnessStartDate,
                "visitedDate": values.VisitedDate,
                "hospitalName": values.HospitalName,
                "doctorName": values.DoctorName,
                "diseaseDiagnosed": values.DiseasesDiagnosed,
                "furtherTests": values.FurtherTests,
                "totalMedicalCost": values.TotalMedicalCost,
                "remarks": values.Remarks
        });
        let result = {};
        fetch(base_url+"/medical-treatment", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ successDisplay: true });
            this.setState({ loading: false, isVisible: true });
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully added child medical treatment '});

        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add child medical treatment details. Please contact the Admin.'});
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
                       IllnessStartDate: this.state.startDate,
                       VisitedDate: this.state.visitDate,
                       HospitalName: '',
                       DoctorName: '',
                       DiseasesDiagnosed: '',
                       FurtherTests: '',
                       TotalMedicalCost: '',
                       Remarks: ''
                    }
                }
                validationSchema = {MedicalTreatmentSchema}
                onSubmit = {async (values, actions) => {

                    console.log(values);
                    this.setState({startDate:'',visitDate:''});
                    this.submitMedicalTreatmentForm(values);
//                    console.log(result);
//                    alert("Data Has been submitted")
                    actions.resetForm();

                }}
                >
   { props => (
               <ScrollView showsVerticalScrollIndicator = {false}>
               <View>
                    <Text style={globalStyles.label}>Illness Start Date: <Text style={{ color: "red" }}>*</Text></Text>
                        <View style={globalStyles.dobView}>
                         <TextInput
                          style={globalStyles.inputform, globalStyles.dobValue}
                          value={this.state.startDate}
                          onValueChange={props.handleChange('IllnessStartDate')}
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
                                                                    onChange={(e, date) => this._pickStartDate(e, date, props.handleChange('IllnessStartDate'))}
                                                                    maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                                                />
                                                            }

                         </View>
                         <Text style={globalStyles.errormsgform}> {props.touched.IllnessStartDate && props.errors.IllnessStartDate}</Text>

                    <Text style={globalStyles.label}>Visited Date: <Text style={{ color: "red" }}>*</Text></Text>
                        <View style={globalStyles.dobView}>
                                           <TextInput
                                               style={globalStyles.inputform, globalStyles.dobValue}
                                               value={this.state.visitDate}
                                               onValueChange={props.handleChange('VisitedDate')}
                                           />
                                           <TouchableHighlight onPress={this.showVisitedDatepicker}>
                                               <View>
                                                   <Feather style={globalStyles.dobBtn} name="calendar" />
                                               </View>
                                           </TouchableHighlight>

                                           {this.state.showVD&&
                                               <DateTimePicker
                                                   style={{ width: 100 }}
                                                   mode="date" //The enum of date, datetime and time
                                                   value={new Date()}
                                                   mode={'date'}
                                                   onChange={(e, date) => this._pickVisitedDate(e, date, props.handleChange('VisitedDate'))}
                                                   maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                               />
                                           }
                                      </View>
                                    <Text style={globalStyles.errormsgform}>{props.touched.VisitedDate && props.errors.VisitedDate}</Text>


               <Text style={globalStyles.label}>Hospital Name/Clinic Name: <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput style={globalStyles.inputText} multiline ={true} value={props.values.HospitalName} onChangeText ={props.handleChange("HospitalName")} onBlur ={props.handleBlur("HospitalName")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.HospitalName && props.errors.HospitalName}
                                        </Text>

               <Text style={globalStyles.label}>Doctor Name/Nurse Name: <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput style={globalStyles.inputText} value={props.values.DoctorName} onChangeText ={props.handleChange("DoctorName")} onBlur ={props.handleBlur("DoctorName")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.DoctorName && props.errors.DoctorName}
                                        </Text>

               <Text style={globalStyles.label}>Diseases Diagnosed: <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput style={globalStyles.inputText} multiline ={true} value={props.values.DiseasesDiagnosed} onChangeText ={props.handleChange("DiseasesDiagnosed")} onBlur ={props.handleBlur("DiseasesDiagnosed")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.DiseasesDiagnosed && props.errors.DiseasesDiagnosed}
                                        </Text>

               <Text style={globalStyles.label}>Further Tests:</Text>
                    <TextInput style={globalStyles.inputText} multiline ={true}  value={props.values.FurtherTests} onChangeText ={props.handleChange("FurtherTests")} onBlur ={props.handleBlur("FurtherTests")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.FurtherTests && props.errors.FurtherTests}
                                        </Text>

               <Text style={globalStyles.label}>Total Medical Cost(Rs): <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput style={globalStyles.inputText} value={props.values.TotalMedicalCost} onChangeText ={props.handleChange("TotalMedicalCost")} onBlur ={props.handleBlur("TotalMedicalCost")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.TotalMedicalCost && props.errors.TotalMedicalCost}
                                        </Text>

               <Text style={globalStyles.label}>Remarks:</Text>
                    <TextInput style={globalStyles.inputText} multiline ={true} value={props.values.Remarks} onChangeText ={props.handleChange("Remarks")} onBlur ={props.handleBlur("Remarks")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.Remarks && props.errors.Remarks}
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
                              <SuccessDisplay successDisplay={this.state.successDisplay} type='MedicalTreatment Status' childNo={this.state.child.firstName} />
                              </View>
    </Modal>
     <LoadingDisplay loading={this.state.loading}/>
    </View>
    );
    }
}
