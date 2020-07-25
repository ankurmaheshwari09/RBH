import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView, KeyboardAvoidingView, Image, TouchableOpacity} from 'react-native';
import {useField, useFormikContext, Formik} from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Feather} from '@expo/vector-icons';
import {TouchableHighlight} from 'react-native-gesture-handler';
import moment from 'moment';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import {base_url} from '../constants/Base';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';

const HealthCheckListSchema = yup.object({
  showGeneralCheckUpDateError: yup.boolean(),
  generalCheckUpName: yup.string(),
  generalCheckUpNameDetails: yup.string().when('generalCheckUpName', {
      is: 'Other',then: yup.string().required("New GeneralCheckUp Name is a required field")
  }),
  generalCheckUpDate: yup.string().when('showGeneralCheckUpDateError', {
      is: true, then: yup.string().required("GeneralCheckUp Date is a required field")
  }),
    HIVTest: yup.string(),
    //HIVTestResult: yup.string().required("HIV Test Result is a required field"),
    TBTest: yup.string(),
    //TBTestResult: yup.string().required("TB Test Result is a required field"),
    Deworming: yup.string(),
    //DewormingDate: yup.string().required("Deworming Date is a required field"),
    Gynecology: yup.string(),
    //GynecologyDate: yup.string().required("Gynecology Date is a required field")
});

export default class ChildHealthCheckList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            child: this.props.navigation.getParam('child'),
            isVisible: false,
            loading: false,
            errorDisplay: false,
            successDisplay: false,
            DewormingDate: '',
            GynecologyDate: '',
            showHIVTestDetails: false,
            HIVTestResultError: false,
            HIVTestDateError: false,
            showTBTestDetails: false,
            TBTestResultError: false,
            TBTestDateError:false,
            showElementHIVTestDate: false,
            showElementTBTestDate: false,
            showElementDewormingDate: false,
            showDewormingDate: false,
            showElementGynecologyDate: false,
            showGynecologyDate: false,
            DewormingDateError: false,
            GynecologyDateError: false,
            generalCheckUpDate:'',
            generalCheckUpName:'',
            generalCheckUpNameDetails:'',
            showGeneralCheckUpDate:false,
            showElementsGeneralCheckUp:false,
            showElementGeneralCheckUpDate: false
        }
        this._pickHIVTestDate = this._pickHIVTestDate.bind(this);
        this._pickTBTestDate = this._pickTBTestDate.bind(this);
        this._pickDewormingDate = this._pickDewormingDate.bind(this);
        this._pickGynecologyDate = this._pickGynecologyDate.bind(this);
        this._pickGeneralCheckUpDate = this._pickGeneralCheckUpDate.bind(this);

    }

    handleHIVTestDate = date => {
        this.setState({
          HIVTestDate: date
        });
    };
    handleTBTestDate = date => {
        this.setState({
          TBTestDate: date
        });
    };
    handleGeneralCheckUpDate = date => {
        this.setState({
          generalCheckUpDate: date
        });
    };
    handleDewormingDate = date => {
        this.setState({
          DewormingDate: date
        });
    };
    handleGynecologyDate = date => {
        this.setState({
          GynecologyDate: date
        });
    };

    _pickHIVTestDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            HIVTestDate: a, showElementHIVTestDate: false, HIVTestDateError: false
        });
        handleChange(a);
    }
    _pickTBTestDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            TBTestDate: a, showElementTBTestDate: false, TBTestDateError: false
        });
        handleChange(a);
    }

    _pickGeneralCheckUpDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            generalCheckUpDate: a, showElementGeneralCheckUpDate: false
        });
        handleChange(a);
    }

    _pickDewormingDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            DewormingDate: a, showElementDewormingDate: false, DewormingDateError: false
        });
        handleChange(a);
    }

    _pickGynecologyDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            GynecologyDate: a, showElementGynecologyDate: false, GynecologyDateError: false
        });
        handleChange(a);
    }

    showHIVTestDatepicker = () => {
            this.setState({ showElementHIVTestDate: true });
    };
    showTBTestDatepicker = () => {
            this.setState({ showElementTBTestDate: true });
    };
    showDewormingDatepicker = () => {
            this.setState({ showElementDewormingDate: true });
    };
    showGynecologyDatepicker = () => {
            this.setState({ showElementGynecologyDate: true });
    };
    showGeneralCheckUpDatepicker = () => {
            this.setState({ showElementGeneralCheckUpDate: true })
    }
    handleDobChange = () => {
        console.log("change called");
    };

    submitChildHealthCheckListForm(values) {
        this.setState({ loading: true });
        let res = true;
        let request_body = JSON.stringify({
            "childNo": this.state.child.childNo,
            "hivTestDone":values.HIVTest,
            "hivTestResult":values.HIVTestResult,
            "hivtestDate":values.HIVTestDate,
            "tbTestDone":values.TBTest,
            "tbTestResult":values.TBTestResult,
            "tbtestDate":values.TBTestDate,
            "generalCheckUpName":values.generalCheckUpName == 'Other' ? values.generalCheckUpNameDetails : values.generalCheckUpName,
            "generalCheckUpDate":values.generalCheckUpDate,
            "dewormingDone":values.Deworming,
            "dewormingDate":values.DewormingDate,
            "gynecologyCheckupDone":values.Gynecology,
            "gynecologyCheckupDate":values.GynecologyDate,
        });
        let result = {};
        fetch(base_url+"/health-checklist", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: request_body,
        })
        .then((response) => {
            console.log('Child Health Check List Form Status and Response are', response.status, 'and', response.ok);
           this.setState({ loading: false, isVisible: true });
           if (response.ok) {
               response.json().then((res) => {
                   console.log(res);
               });
               this.setState({ successDisplay: true });
//                   this.setState({submitAlertMessage: 'Successfully added child health checklist details'});
//                   alert(this.state.submitAlertMessage);
           } else {
               throw Error(response.status);
           }
        })
//        .then((responseJson) => {
//            console.log(responseJson);
//            this.setState({ successDisplay: true });
//        })
        .catch((error) => {
            console.log(error);
            this.setState({ errorDisplay: true });
//            this.setState({submitAlertMessage: 'Unable to add child health checklist details. Please contact the Admin.'});
//            alert(this.state.submitAlertMessage);
        });
    }

    render() {
        return (
            <View style = {globalStyles.container}>
              <View style={globalStyles.backgroundlogoimageview}>
                            <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                        </View>

                <Formik
                    initialValues = {
                        {
                            HIVTest: '',
                            HIVTestResult: '',
                            HIVTestDate: '',
                            TBTest: '',
                            TBTestResult: '',
                            TBTestDate: '',
                            generalCheckUpName:'',
                            generalCheckUpNameDetails:'',
                            generalCheckUpDate:'',
                            showGeneralCheckUpDateError:false,
                            Deworming: '',
//                            DewormingDate: this.state.DewormingDate,
                            DewormingDate:'',
                            // CampsCheckUps: '',
                            Gynecology: '',
                            GynecologyDate: '',
//                            GynecologyDate: this.state.GynecologyDate,
                        }
                    }
                    validationSchema = {HealthCheckListSchema}
                    onSubmit = { async (values, actions) => {
                        console.log(values);
                        this.setState({ HIVTestResultError: false, TBTestResultError: false, HIVTestDateError: false,
                          TBTestDateError:false, DewormingDateError: false, GynecologyDateError:false});
                        if(values.HIVTestResult == '' && this.state.showHIVTestDetails == true) {
                            this.setState({ HIVTestResultError: true});
                        } if(values.HIVTestDate == '' && this.state.showHIVTestDetails == true) {
                            this.setState({ HIVTestDateError: true});
                        } if(values.TBTestResult == '' && this.state.showTBTestDetails == true) {
                            this.setState({ TBTestResultError: true});
                        } if(values.TBTestDate == '' && this.state.showTBTestDetails == true) {
                            this.setState({ TBTestDateError: true});
                        } if(values.DewormingDate == '' && this.state.showDewormingDate == true) {
                            this.setState({ DewormingDateError: true});
                        } if(values.GynecologyDate == '' && this.state.showGynecologyDate == true) {
                            this.setState({ GynecologyDateError: true});
                        }
                        if(!this.state.HIVTestResultError && !this.state.TBTestResultError && !this.state.HIVTestDateError &&
                          !this.state.TBTestDateError && !this.state.DewormingDateError && !this.state.GynecologyDateError) {
                            this.submitChildHealthCheckListForm(values);
                            actions.resetForm();
                            this.setState({ errorDisplay:false, successDisplay:false})
                            this.setState({DewormingDate:'', GynecologyDate:'', TBTestDate:'', HIVTestDate:'',generalCheckUpName:'',generalCheckUpNameDetails:'',
                                           HIVTestResultError:false, HIVTestDateError:false, TBTestResultError:false, TBTestDateError:false,
                                           showHIVTestDetails:false, showTBTestDetails:false, showDewormingDate:false,
                                           showGynecologyDate:false, showElementHIVTestDate:false, showElementTBTestDate:false,
                                           showElementDewormingDate:false, showElementGynecologyDate:false,showElementGeneralCheckUpDate:false,
                                           DewormingDateError:false, GynecologyDateError:false,
                                           generalCheckUpDate:'',showGeneralCheckUpDate:false,showElementsGeneralCheckUp:false,showGeneralCheckUpDateError:false});
                        }
                    }}
                >
                    {props => (
                        <ScrollView showsVerticalScrollIndicator = {false}>
                            <View>
                                <Text style = {globalStyles.label}>HIV Test:</Text>

                                <Picker
                                    selectedValue = {props.values.HIVTest}
                                    style = {globalStyles.dropDown}

                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('HIVTest', itemValue)
                                        if(itemValue == 'true'){
                                          this.setState({showHIVTestDetails : true})
                                        } else{
                                          this.setState({showHIVTestDetails : false});
                                          props.setFieldValue('HIVTestResult','');
                                          props.setFieldValue('HIVTestDate','')
                                        }
                                    }}
                                    value = {props.values.HIVTest}
                                >
                                    <Picker.Item color='grey' label='Select HIV Test' value = ''/>
                                    <Picker.Item label='Taken' value = 'true'/>
                                    <Picker.Item label='Not Taken' value = 'false'/>
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.HIVTest && props.errors.HIVTest}</Text>

                                {this.state.showHIVTestDetails ?
                                    <View>
                                    <Text style = {globalStyles.label}>HIV Test Result: <Text style={{ color: "red" }}>*</Text> </Text>
                                    <Picker
                                        selectedValue = {props.values.HIVTestResult}
                                        style = {globalStyles.dropDown}

                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('HIVTestResult', itemValue);
                                            if(itemValue==''){
                                                this.setState({HIVTestResultError: true})
                                            } else{
                                            this.setState({HIVTestResultError: false})
                                            }
                                        }}
                                        value = {props.values.HIVTestResult}
                                    >
                                        <Picker.Item color = 'grey' label='Select HIV Test Result' value = ''/>
                                        <Picker.Item label='Positive' value = 'true'/>
                                        <Picker.Item label='Negative' value = 'false'/>
                                    </Picker>
                                    </View>
                                :null}
                                {this.state.HIVTestResultError ? <Text style={globalStyles.errormsg}> HIV Test Result is a required field </Text> : null}

                                {this.state.showHIVTestDetails ?
                                <View style={globalStyles.dobView}>
                                    <Text style = {globalStyles.label}>HIV Test Date <Text style={{ color: "red" }}>*</Text> </Text>
                                    <TextInput
                                        style={globalStyles.inputText, globalStyles.dobValue}
                                        value={this.state.HIVTestDate}
                                        editable={false}
                                        onValueChange={props.handleChange('HIVTestDate')}
                                    />
                                    <TouchableHighlight onPress={this.showHIVTestDatepicker}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn} name="calendar" />
                                        </View>
                                    </TouchableHighlight>
                                    {this.state.showElementHIVTestDate &&
                                        <DateTimePicker
                                            style={{ width: 100 }}
                                            mode="date"
                                            value={new Date()}
                                            mode={'date'}
                                            onChange={(e, date) => this._pickHIVTestDate(e, date, props.handleChange('HIVTestDate'))}
                                            maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                        />
                                    }
                                </View>
                                :null}
                                {this.state.HIVTestDateError ? <Text style={globalStyles.errormsg}> HIV Test Date is a required field </Text> : null}

                                <Text style = {globalStyles.label}>TB Test:</Text>

                                <Picker
                                    selectedValue = {props.values.TBTest}
                                    style = {globalStyles.dropDown}

                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('TBTest', itemValue)
                                        if(itemValue == 'true'){
                                          this.setState({showTBTestDetails : true})
                                        } else{
                                          this.setState({showTBTestDetails : false});
                                          props.setFieldValue('TBTestResult','');
                                          props.setFieldValue('TBTestDate','')
                                        }
                                    }}
                                    value = {props.values.TBTest}
                                >
                                    <Picker.Item color='grey' label='Select TB Test' value = ''/>
                                    <Picker.Item label='Taken' value = 'true'/>
                                    <Picker.Item label='Not Taken' value = 'false'/>
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.TBTest && props.errors.TBTest}</Text>

                                {this.state.showTBTestDetails ?
                                    <View>
                                    <Text style = {globalStyles.label}>TB Test Result: <Text style={{ color: "red" }}>*</Text> </Text>
                                    <Picker
                                        selectedValue = {props.values.TBTestResult}
                                        style = {globalStyles.dropDown}

                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('TBTestResult', itemValue)
                                            if(itemValue==''){
                                                this.setState({TBTestResultError: true});
                                            } else{
                                            this.setState({TBTestResultError: false});
                                            props.setFieldValue('TBTestResult', itemValue)}
                                        }}
                                        value = {props.values.TBTestResult}
                                    >
                                        <Picker.Item color = 'grey' label='Select TB Test Result' value = ''/>
                                        <Picker.Item label='Positive' value = 'true'/>
                                        <Picker.Item label='Negative' value = 'false'/>
                                    </Picker>
                                    </View>
                                :null}
                                {this.state.TBTestResultError ? <Text style={globalStyles.errormsg}> TB Test Result is a required field </Text> : null}

                                {this.state.showTBTestDetails ?
                                <View style={globalStyles.dobView}>
                                    <Text style = {globalStyles.label}>TB Test Date <Text style={{ color: "red" }}>*</Text> </Text>
                                    <TextInput
                                        style={globalStyles.inputText, globalStyles.dobValue}
                                        value={this.state.TBTestDate}
                                        editable={false}
                                        onValueChange={props.handleChange('TBTestDate')}
                                    />
                                    <TouchableHighlight onPress={this.showTBTestDatepicker}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn} name="calendar" />
                                        </View>
                                    </TouchableHighlight>
                                    {this.state.showElementTBTestDate &&
                                        <DateTimePicker
                                            style={{ width: 100 }}
                                            mode="date"
                                            value={new Date()}
                                            mode={'date'}
                                            onChange={(e, date) => this._pickTBTestDate(e, date, props.handleChange('TBTestDate'))}
                                            maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                        />
                                    }
                                </View>
                                :null}
                                {this.state.TBTestDateError ? <Text style={globalStyles.errormsg}> TB Test Date is a required field </Text> : null}


                                <Text style={globalStyles.label}>GeneralCheckUp Name:</Text>
                                <Picker
                                    selectedValue={props.values.generalCheckUpName}
                                    style={globalStyles.dropDown}
                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('generalCheckUpName', itemValue);
                                        props.setFieldValue('generalCheckUpNameDetails','');
                                        props.setFieldValue('generalCheckUpDate','');
                                        if(itemValue==''){
                                            this.setState({ showElementsGeneralCheckUp: false });
                                            this.setState({showGeneralCheckUpDate: false});
                                            props.setFieldValue('showGeneralCheckUpDateError', false);
                                        } else if (itemValue == 'Other') {
                                            this.setState({ showElementsGeneralCheckUp: true });
                                            this.setState({showGeneralCheckUpDate: true});
                                            props.setFieldValue('showGeneralCheckUpDateError', true);
                                        } else {
                                            this.setState({ showElementsGeneralCheckUp: false });
                                            this.setState({showGeneralCheckUpDate: true});
                                            props.setFieldValue('showGeneralCheckUpDateError', true);
                                        }
                                    }}
                                    value={props.values.generalCheckUpName}
                                >
                                    <Picker.Item color='grey' label="Select GeneralCheckUp Name" value='' />
                                    {global.generalCheckUpName.map((item) => {
                                        return <Picker.Item key={item.id} label={item.description} value={item.description} />
                                    })}
                                    <Picker.Item label="Add New GeneralCheckUp Name" value='Other' />
                                </Picker>
                                <Text style={globalStyles.errormsg}>{props.touched.generalCheckUpName && props.errors.generalCheckUpName}</Text>

                                {/*generalCheckUp Name to enter if other is selected*/}
                                {this.state.showElementsGeneralCheckUp ?
                                    <View>
                                        <Text style={globalStyles.label}>New GeneralCheckUp Name: <Text style={{ color: "red" }}>*</Text> </Text>
                                        <TextInput
                                            style={globalStyles.input}
                                            onChangeText={props.handleChange('generalCheckUpNameDetails')}
                                            value={props.values.generalCheckUpNameDetails}
                                        />
                                        < Text style={globalStyles.errormsg}>{props.touched.generalCheckUpNameDetails && props.errors.generalCheckUpNameDetails}</Text>
                                    </View> : null}

                                {/*generalCheckUpDate */}
                                {this.state.showGeneralCheckUpDate ?
                                    <View style={globalStyles.dobView}>
                                        <Text style = {globalStyles.label}>GeneralCheckUp Date <Text style={{ color: "red" }}>*</Text> </Text>
                                        <TextInput
                                            style={globalStyles.inputText, globalStyles.dobValue}
                                            value={props.values.generalCheckUpDate}
                                            editable={false}
                                            onValueChange={props.handleChange('generalCheckUpDate')}

                                        />
                                        <TouchableHighlight onPress={this.showGeneralCheckUpDatepicker}>
                                            <View>
                                                <Feather style={globalStyles.dobBtn} name="calendar" />
                                            </View>
                                        </TouchableHighlight>
                                        {this.state.showElementGeneralCheckUpDate &&
                                            <DateTimePicker
                                                style={{ width: 100 }}
                                                mode="date"
                                                value={new Date()}
                                                mode={'date'}
                                                onChange={(e, date) => this._pickGeneralCheckUpDate(e, date, props.handleChange('generalCheckUpDate'))}
                                                maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                            />
                                        }
                                    </View>
                                :null}
                                <Text style={globalStyles.errormsg}>{props.touched.generalCheckUpDate && props.errors.generalCheckUpDate}</Text>

                                <Text style = {globalStyles.label}>Deworming:</Text>
                                <Picker
                                    selectedValue = {props.values.Deworming}
                                    onValueChange = {props.handleChange('Deworming')}
                                    style = {globalStyles.dropDown}

                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('Deworming', itemValue)
                                        if(itemValue == 'true'){
                                          this.setState({showDewormingDate : true})
                                        } else{
                                          this.setState({showDewormingDate : false});
                                          props.setFieldValue('DewormingDate','')
                                        }
                                    }}
                                    value = {props.values.Deworming}
                                >
                                    <Picker.Item color = 'grey' label='Select Deworming' value = ''/>
                                    <Picker.Item label='Yes' value = 'true'/>
                                    <Picker.Item label='No' value = 'false'/>
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Deworming && props.errors.Deworming}</Text>
                                {this.state.showDewormingDate ?
                                    <View style={globalStyles.dobView}>
                                        <Text style = {globalStyles.label}>Deworming Date <Text style={{ color: "red" }}>*</Text> </Text>
                                        <TextInput
                                            style={globalStyles.inputText, globalStyles.dobValue}
                                            value={this.state.DewormingDate}
                                            editable={false}
                                            onValueChange={props.handleChange('DewormingDate')}

                                        />
                                        <TouchableHighlight onPress={this.showDewormingDatepicker}>
                                            <View>
                                                <Feather style={globalStyles.dobBtn} name="calendar" />
                                            </View>
                                        </TouchableHighlight>
                                        {this.state.showElementDewormingDate &&
                                            <DateTimePicker
                                                style={{ width: 100 }}
                                                mode="date"
                                                value={new Date()}
                                                mode={'date'}
                                                onChange={(e, date) => this._pickDewormingDate(e, date, props.handleChange('DewormingDate'))}
                                                maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                            />
                                        }
                                    </View>
                                :null}
                                {this.state.DewormingDateError ? <Text style={globalStyles.errormsg}> Deworming Date is a required field </Text> : null}

                                <Text style = {globalStyles.label}>Gynecology:</Text>
                                <Picker
                                    selectedValue = {props.values.Gynecology}
                                    onValueChange = {props.handleChange('Gynecology')}
                                    style = {globalStyles.dropDown}

                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('Gynecology', itemValue)
                                        if(itemValue == 'true'){
                                          this.setState({showGynecologyDate : true})
                                        } else{
                                          this.setState({showGynecologyDate : false});
                                          props.setFieldValue('GynecologyDate','')
                                        }
                                    }}
                                    value = {props.values.Gynecology}
                                >

                                    <Picker.Item  color = 'grey' label='Select Gynecology' value = ''/>
                                    <Picker.Item label='Yes' value = 'true'/>
                                    <Picker.Item label='No' value = 'false'/>
                                </Picker>
                                 <Text style = {globalStyles.errormsg}>{props.touched.Gynecology && props.errors.Gynecology}</Text>

                                {this.state.showGynecologyDate ?
                                    <View style={globalStyles.dobView}>
                                        <Text style = {globalStyles.label}>Gynecology Date <Text style={{ color: "red" }}>*</Text> </Text>
                                        <TextInput
                                            style={globalStyles.inputText, globalStyles.dobValue}
                                            value={this.state.GynecologyDate}
                                            editable={false}
                                            onValueChange={props.handleChange('GynecologyDate')}
                                        />
                                        <TouchableHighlight onPress={this.showGynecologyDatepicker}>
                                            <View>
                                                <Feather style={globalStyles.dobBtn} name="calendar" />
                                            </View>
                                        </TouchableHighlight>
                                        {this.state.showElementGynecologyDate &&
                                            <DateTimePicker
                                                style={{ width: 100 }}
                                                mode="date"
                                                value={new Date()}
                                                mode={'date'}
                                                onChange={(e, date) => this._pickGynecologyDate(e, date, props.handleChange('GynecologyDate'))}
                                                maximumDate={new Date((new Date()).setDate((new Date()).getDate() - 1))}
                                            />
                                        }
                                    </View>
                                :null}
                                {this.state.GynecologyDateError ? <Text style={globalStyles.errormsg}> Gynecology Date is a required field </Text> : null}

                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                            </View>
                        </ScrollView>
                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.feedbackContainer}>
                      <TouchableOpacity style={globalStyles.closeModalIcon} onPress={() => this.setState({ isVisible: false })}>
                          <View>
                                  <Ionicons name="md-close" size={22}></Ionicons>
                          </View>
                      </TouchableOpacity>
                      <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                      <SuccessDisplay successDisplay={this.state.successDisplay} type='Health CheckList Status' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}
