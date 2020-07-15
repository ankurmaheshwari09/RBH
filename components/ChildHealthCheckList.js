import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView, KeyboardAvoidingView, Image} from 'react-native';
import {useField, useFormikContext, Formik} from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Feather} from '@expo/vector-icons';
import {TouchableHighlight} from 'react-native-gesture-handler';
import moment from 'moment';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import {base_url} from '../constants/Base';
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const HealthCheckListSchema = yup.object({
    HIVTest: yup.string().required("HIV Test is a required field"),
    //HIVTestResult: yup.string().required("HIV Result is a required field"),
    TBTest: yup.string().required("TB Test is a required field"),
    //TBTestResult: yup.string().required("TB Result is a required field"),
    Deworming: yup.string().required("Deworming is a required field"),
    //DewormingDate: yup.string().required("Deworming Date is a required field"),
    CampsCheckUps: yup.string().required("Camps Check Ups is a required field"),
    Gynecology: yup.string().required("Gynecology is a required field"),
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
            showHIVTestResult: false,
            HIVTestResultError: false,
            showTBTestResult: false,
            TBTestResultError: false,
            showElementDewormingDate: false,
            showDewormingDate: false,
            showElementGynecologyDate: false,
            showGynecologyDate: false,
            DewormingDateError: false,
            GynecologyDateError: false
        }
        this._pickDewormingDate = this._pickDewormingDate.bind(this);
        this._pickGynecologyDate = this._pickGynecologyDate.bind(this);
    }

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

    showDewormingDatepicker = () => {
        this.setState({ showElementDewormingDate: true });
    };

    showGynecologyDatepicker = () => {
            this.setState({ showElementGynecologyDate: true });
    };

    handleDobChange = () => {
        console.log("change called");
    };

    submitChildHealthCheckListForm(values) {
        let res = true;
        let request_body = JSON.stringify({
            "childNo": this.state.child.childNo,
            "hivTestDone":values.HIVTest,
            "hivTestResult":values.HIVTestResult,
            "tbTestDone":values.TBTest,
            "tbTestResult":values.TBTestResult,
            "dewormingDone":values.Deworming,
            "dewormingDate":values.DewormingDate,
            "campCheckupNotes":values.CampsCheckUps,
            "gynecologyCheckupDone":values.Gynecology,
            "gynecologyCheckupDate":values.GynecologyDate,
        });
        let result = {};
        fetch(base_url+"/health-checklist", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => {
//            response.json())
            console.log('Child Health Check List Form Status and Response are', response.status, 'and', response.ok);
           this.setState({ loading: false, isVisible: true, });
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
                            TBTest: '',
                            TBTestResult: '',
                            Deworming: '',
//                            DewormingDate: this.state.DewormingDate,
                            DewormingDate:'',
                            CampsCheckUps: '',
                            Gynecology: '',
                            GynecologyDate: '',
//                            GynecologyDate: this.state.GynecologyDate,
                        }
                    }
                    validationSchema = {HealthCheckListSchema}
                    onSubmit = { async (values, actions) => {
                        console.log(values);
                        this.setState({ HIVTestResultError: false, TBTestResultError: false, DewormingDateError: false, GynecologyDateError:false});
                        if(values.HIVTestResult == '' && this.state.showHIVTestResult == true) {
                            this.setState({ HIVTestResultError: true});
                        } if(values.TBTestResult == '' && this.state.showTBTestResult == true) {
                            this.setState({ TBTestResultError: true});
                        } if(values.DewormingDate == '' && this.state.showDewormingDate == true) {
                            this.setState({ DewormingDateError: true});
                        } if(values.GynecologyDate == '' && this.state.showGynecologyDate == true) {
                            this.setState({ GynecologyDateError: true});
                        }
                        if(!this.state.HIVTestResultError && !this.state.TBTestResultError && !this.state.DewormingDateError && !this.state.GynecologyDateError) {
                            this.submitChildHealthCheckListForm(values);
                            actions.resetForm();
                            this.setState({isVisible:false, loading:false, errorDisplay:false, successDisplay:false})
                            this.setState({DewormingDate:'', GynecologyDate:'', HIVTestResultError:false, TBTestResultError:false,
                                           showHIVTestResult:false, showTBTestResult:false, showDewormingDate:false,
                                           showGynecologyDate:false, showElementDewormingDate:false, showElementGynecologyDate:false,
                                           DewormingDateError:false, GynecologyDateError:false});
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
                                        this.setState({showHIVTestResult : true})
                                        } else{
                                        this.setState({showHIVTestResult : false})}
                                    }}
                                    value = {props.values.HIVTest}
                                >
                                    <Picker.Item color='grey' label='Select HIV Test' value = ''/>
                                    <Picker.Item label='Taken' value = 'true'/>
                                    <Picker.Item label='Not Taken' value = 'false'/>
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.HIVTest && props.errors.HIVTest}</Text>

                                {this.state.showHIVTestResult ?
                                    <View>
                                    <Text style = {globalStyles.text}>HIV Test Result:</Text>
                                    <Picker
                                        selectedValue = {props.values.HIVTestResult}
                                        style = {globalStyles.dropDown}

                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('HIVTestResult', itemValue);
                                            if(itemValue==''){
                                                this.setState({HIVTestResultError: true})
                                            } else{
                                            this.setState({HIVTestResultError: false});
                                            }
                                        }}
                                        value = {props.values.HIVTestResult}
                                    >
                                        <Picker.Item label='Select HIV Test Result' value = ''/>
                                        <Picker.Item label='Positive' value = 'true'/>
                                        <Picker.Item label='Negative' value = 'false'/>
                                    </Picker>
                                    </View>
                                :null}
                                {this.state.HIVTestResultError ? <Text style={globalStyles.errormsg}> HIV Test Result is a required field </Text> : null}

                                <Text style = {globalStyles.label}>TB Test:</Text>

                                <Picker
                                    selectedValue = {props.values.TBTest}
                                    style = {globalStyles.dropDown}

                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('TBTest', itemValue)
                                        if(itemValue == 'true'){
                                        this.setState({showTBTestResult : true})
                                        } else{
                                        this.setState({showTBTestResult : false}) }
                                    }}
                                    value = {props.values.TBTest}
                                >
                                    <Picker.Item color='grey' label='Select TB Test' value = ''/>
                                    <Picker.Item label='Taken' value = 'true'/>
                                    <Picker.Item label='Not Taken' value = 'false'/>
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.TBTest && props.errors.TBTest}</Text>

                                {this.state.showTBTestResult ?
                                    <View>
                                    <Text style = {globalStyles.label}>TB Test Result:</Text>
                                    <Picker
                                        selectedValue = {props.values.TBTestResult}
                                        style = {globalStyles.dropDown}

                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('TBTestResult', itemValue)
                                            if(itemValue==''){
                                                this.setState({TBTestResultError: true})
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
                                        this.setState({showDewormingDate : false})}
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
                                        <Text style = {globalStyles.text}>Deworming Date:</Text>
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
                                {this.state.DewormingDateError ? <Text style={globalStyles.errormsg}> DewormingDate is a required field </Text> : null}

                                <Text style = {globalStyles.label}>Camps Check Ups:</Text>

                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('CampsCheckUps')}
                                    value = {props.values.CampsCheckUps}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.CampsCheckUps && props.errors.CampsCheckUps}</Text>
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
                                        this.setState({showGynecologyDate : false})}
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
                                        <Text style = {globalStyles.text}>Gynecology Date</Text>
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
                                {this.state.GynecologyDateError ? <Text style={globalStyles.errormsg}> GynecologyDate is a required field </Text> : null}

                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                            </View>
                        </ScrollView>
                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Health CheckList Status' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}

// const Styles = StyleSheet.create({
//     healthformheading: {
//         fontSize: 18,
//         alignSelf: 'center',
//         marginBottom: 35,
//         marginTop: 10,
//         backgroundColor:'#48BBEC',
//         color: 'white',
//         borderWidth: 1,
//         borderRadius: 8
//     },
//     dobView: {
//         flex: 1,
//         flexDirection: 'row'
//     },
//     dobValue: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         padding: 10,
//         marginBottom: 10,
//         fontSize: 18,
//         borderRadius: 6,
//         flex: 3,
//         marginLeft: 10,
//         marginRight: 15
//     },
//     dobBtn: {
//         marginLeft: 2,
//         flex: 2,
//         fontSize: 40,
//         marginRight: 15
//     },
//     MainContainer: {
//         justifyContent: 'space-between',
//         flex: 1,
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         alignSelf: 'center',
//         backgroundColor: 'white',
//         width: Dimensions.get('window').width / 2 + 50,
//         maxHeight: Dimensions.get('window').height / 4,
//         top: 150,
//         borderRadius: 30
//     }
// });
