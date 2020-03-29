import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView,Alert, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import {base_url} from '../constants/Base';

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
constructor(){
super()
this.state ={
startDate: '',
visitDate: '',
showSD: false,
showVD: false,
submitAlertMessage: '',
}
}

_pickStartDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('DD/MM/YYYY');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            startDate: a, showSD: false
        });
        handleChange(a);
    }

_pickVisitedDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('DD/MM/YYYY');
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
        let request_body = JSON.stringify({
                "IllnessStartDate": values.IllnessStartDate,
                "VisitedDate": values.VisitedDate,
                "HospitalName": values.HospitalName,
                "DoctorName": values.DoctorName,
                "DiseasesDiagnosed": values.DiseasesDiagnosed,
                "FurtherTests": values.FurtherTests,
                "TotalMedicalCost": values.TotalMedicalCost,
                "Remarks": values.Remarks
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
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully added child medical treatment '});
            alert(this.state.submitAlertMessage);
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add child medical treatment details. Please contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
        });
    }
    render() {
        return (
            <View style = {globalStyles.formcontainer}>
                <Text style ={Styles.healthformheading}>       Child Medical Treatment      </Text>
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
                    let result = this.submitMedicalTreatmentForm(values);
                    console.log(result);
                    alert("Data Has been submitted")
                    actions.resetForm();

                }}
                >
   { props => (
               <ScrollView>
               <View>
                    <Text style={globalStyles.textform}>IllnessStartDate</Text>
                        <View style={Styles.dobView}>
                         <TextInput
                          style={globalStyles.inputform, Styles.dobValue}
                          value={this.state.startDate}
                          onValueChange={props.handleChange('IllnessStartDate')}
                          />
                         <TouchableHighlight onPress={this.showStartDatepicker}>
                           <View>
                           <Feather style={Styles.dobBtn} name="calendar" />
                           </View>
                           </TouchableHighlight>
                                                            {this.state.showSD &&
                                                                <DateTimePicker
                                                                    style={{ width: 100 }}
                                                                    mode="date" //The enum of date, datetime and time
                                                                    value={new Date()}
                                                                    mode={'date'}
                                                                    onChange={(e, date) => this._pickStartDate(e, date, props.handleChange('IllnessStartDate'))}
                                                                />
                                                            }
                          <Text style={globalStyles.errormsgform}> {props.touched.IllnessStartDate && props.errors.IllnessStartDate}</Text>
                         </View>
                    <Text style={globalStyles.textform}>VisitedDate</Text>
                        <View style={Styles.dobView}>
                                           <TextInput
                                               style={globalStyles.inputform, Styles.dobValue}
                                               value={this.state.visitDate}
                                               onValueChange={props.handleChange('VisitedDate')}
                                           />
                                           <TouchableHighlight onPress={this.showVisitedDatepicker}>
                                               <View>
                                                   <Feather style={Styles.dobBtn} name="calendar" />
                                               </View>
                                           </TouchableHighlight>

                                           {this.state.showVD&&
                                               <DateTimePicker
                                                   style={{ width: 100 }}
                                                   mode="date" //The enum of date, datetime and time
                                                   value={new Date()}
                                                   mode={'date'}
                                                   onChange={(e, date) => this._pickVisitedDate(e, date, props.handleChange('VisitedDate'))}
                                               />
                                           }
                                    <Text style={globalStyles.errormsgform}>{props.touched.VisitedDate && props.errors.VisitedDate}</Text>
                         </View>

               <Text style={globalStyles.textform}>HospitalName</Text>
                    <TextInput style={globalStyles.inputform} multiline ={true} value={props.values.HospitalName} onChangeText ={props.handleChange("HospitalName")} onBlur ={props.handleBlur("HospitalName")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.HospitalName && props.errors.HospitalName}
                                        </Text>

               <Text style={globalStyles.textform}>DoctorName</Text>
                    <TextInput style={globalStyles.inputform} value={props.values.DoctorName} onChangeText ={props.handleChange("DoctorName")} onBlur ={props.handleBlur("DoctorName")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.DoctorName && props.errors.DoctorName}
                                        </Text>

               <Text style={globalStyles.textform}>DiseasesDiagnosed</Text>
                    <TextInput style={globalStyles.inputform} multiline ={true} value={props.values.DiseasesDiagnosed} onChangeText ={props.handleChange("DiseasesDiagnosed")} onBlur ={props.handleBlur("DiseasesDiagnosed")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.DiseasesDiagnosed && props.errors.DiseasesDiagnosed}
                                        </Text>

               <Text style={globalStyles.textform}>FurtherTests</Text>
                    <TextInput style={globalStyles.inputform} multiline ={true}  value={props.values.FurtherTests} onChangeText ={props.handleChange("FurtherTests")} onBlur ={props.handleBlur("FurtherTests")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.FurtherTests && props.errors.FurtherTests}
                                        </Text>

               <Text style={globalStyles.textform}>TotalMedicalCost(Rs)</Text>
                    <TextInput style={globalStyles.inputform} value={props.values.TotalMedicalCost} onChangeText ={props.handleChange("TotalMedicalCost")} onBlur ={props.handleBlur("TotalMedicalCost")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.TotalMedicalCost && props.errors.TotalMedicalCost}
                                        </Text>

               <Text style={globalStyles.textform}>Remarks</Text>
                    <TextInput style={globalStyles.inputform} multiline ={true} value={props.values.Remarks} onChangeText ={props.handleChange("Remarks")} onBlur ={props.handleBlur("Remarks")}></TextInput>
                                        <Text style={globalStyles.errormsgform}>
                                        {props.touched.Remarks && props.errors.Remarks}
                                        </Text>

               <Button title="Submit" onPress={props.handleSubmit} />
               </View>
               </ScrollView>
              )
   }
    </Formik>
    </View>
    );
    }
}
const Styles = StyleSheet.create({
 dobView: {
        flex: 1,
        flexDirection: 'row',
    },
    dobValue: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
        marginLeft: 10,
        marginRight: 15
    },
    dobBtn: {
        marginLeft: 2,
        flex: 2,
        fontSize: 40,
        marginRight: 15
    },
    healthformheading: {
                   fontSize: 18,
                   alignSelf: 'center',
                   marginBottom: 35,
                   marginTop: 10,
                   backgroundColor:'#48BBEC',
                   color: 'white',
                   borderWidth: 1,
                   borderRadius: 8
        },

});