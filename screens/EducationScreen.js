import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView, KeyboardAvoidingView, Image, Field, StyleSheet, Dimensions
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/global';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const EducationFormSchema = yup.object({
    Class: yup.string().required(),
    Medium: yup.string().required(),
    SchoolName: yup.string().required(),
    SchoolType: yup.string().required(),
    SchoolPlace: yup.string().required(),
    StartingDate: yup.string().required()
})

export default class EducationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            showElements: false,
            showSSElements: false,
            child: this.props.navigation.getParam('child'),
            showSD: false,
            showED: false,
            startingdate: '',
            endingdate: '',
            studyingclass: [],
            medium: [],
            studyingtype: [],
            childstaytype: [],
            scholoshiptype: [],
        }
    }
    _pickStartDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            startingdate: a, showSD: false
        });
        handleChange(a);
    }

    _pickEndDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            endingdate: a, showED: false
        });
        handleChange(a);
    }
    showSDDatepicker = () => {
        this.setState({ showSD: true });
    };
    showEDDatepicker = () => {
        this.setState({ showED: true });
    };

    handleDobChange = () => {
        console.log("change called");
    }

    updateEducationDetails(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
            "childNo": this.state.child.childNo,
            "schoolName": values.SchoolName,
            "schooltype": values.SchoolType,
            "studyingclass": values.Class,
            "medium": values.Medium,
            "date_from": values.StartingDate,
            "date_to": values.EndingDate,
            "stayType": values.ChildStayType,
            "bridgeCourse": values.BridgeCourse,
            "classDetails": values.CDetail,
            "sponsorship": values.ScholarshipSponsorship,
            "sponsorshipFor": this.state.scholoshiptype.sort().join(','),
            "modified_on": new Date(),

        });
        console.log(values);
        const path = `child-education`;
        UpdateApi.addData(request_body, path).then((response) => {
            this.setState({ loading: false, isVisible: true });
            if (response.ok) {
                response.json().then((res) => {
                    console.log(res + "res");
                });
                this.setState({ successDisplay: true });

            } else {
                throw Error(response.status);
            }
        }).catch(error => {
            console.log(error, 'error');
            this.setState({ errorDisplay: true });

        });

    }
    componentWillUnmount() {
        if (this.state.successDisplay) {
            const { params } = this.props.navigation.state;
            params.refreshChildList();
        }

    }
    render() {
        return (<View style={globalStyles.container}>
            <View style={globalStyles.backgroundlogoimageview}>
                <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
            </View>
            <Formik
                initialValues={
                    {
                        Class: '',
                        Medium: '',
                        SchoolName: '',
                        SchoolType: '',
                        SchoolPlace: '',
                        StartingDate: this.state.startingdate,
                        EndingDate: this.state.endingdate,
                        ChildStayType: '',
                        BridgeCourse: '',
                        CDetail: '',
                        BridgeCourseSchoolName: '',
                        ScholarshipSponsorship: '',
                        scholorshiptype: '',
                        Literacytatus: '',
                        FirstGenLearner: '',
                    }
                }
                validationSchema={EducationFormSchema}
                onSubmit={async (values, actions) => {
                    console.log(values);
                    console.log("Submit method called here ");
                    this.setState({ showLoader: true, loaderIndex: 10 });
                    let result = this.updateEducationDetails(values);
                    let alertMessage = this.state.submitAlertMessage;
                    console.log(result);
                    actions.resetForm();
                }}
            >
                {props => (
                    <KeyboardAvoidingView behavior="padding"
                        enabled style={globalStyles.keyboardavoid}
                        keyboardVerticalOffset={200}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View>
                                {/*Child Name*/}
                                <Text style={globalStyles.label}>Child Name:</Text>
                                <TextInput
                                    style={globalStyles.disabledBox}
                                    value={this.state.child.firstName} //value updated in 'values' is reflected here
                                    editable={false}
                                    selectTextOnFocus={false}
                                />

                                {/*Child Class*/}
                                <Text style={globalStyles.label}>Class: <Text style={{ color: "red" }}>*</Text> </Text>
                                <Picker
                                    selectedValue={props.values.Class}
                                    style={globalStyles.dropDown}
                                    onValueChange={(Class) => props.setFieldValue('Class', Class)}
                                    value={props.values.Class}
                                >
                                    <Picker.Item color='grey' label="Select Class" value="" />
                                    {global.studyingclass.map((item) => {
                                        return <Picker.Item key={item.studyingclassId} label={item.studyingclass} value={item.studyingclassId} />
                                    })}
                                </Picker>
                                <Text style={globalStyles.errormsg}>{props.touched.Class && props.errors.Class}</Text>

                                {/*Child Medium*/}
                                <Text style={globalStyles.label}>Medium:  <Text style={{ color: "red" }}>*</Text> </Text>
                                <Picker
                                    selectedValue={props.values.Medium}
                                    style={globalStyles.dropDown}
                                    onValueChange={(Medium) => props.setFieldValue('Medium', Medium)}
                                    value={props.values.Medium}
                                >
                                    <Picker.Item color='grey' label="Select Medium" value="" />
                                    {global.medium.map((item) => {
                                        return <Picker.Item key={item.motherTongueId} label={item.motherTongue} value={item.motherTongueId} />
                                    })}
                                </Picker>
                                <Text style={globalStyles.errormsg}>{props.touched.Medium && props.errors.Medium}</Text>

                                {/*School Name*/}
                                <Text style={globalStyles.label}>School/College/Institution Name: <Text style={{ color: "red" }}>*</Text> </Text>
                                <TextInput
                                    style={globalStyles.input}
                                    onChangeText={props.handleChange('SchoolName')}
                                    value={props.values.SchoolName}
                                />
                                <Text style={globalStyles.errormsg}>{props.touched.SchoolName && props.errors.SchoolName}</Text>

                                {/*School Type*/}
                                <Text style={globalStyles.label}>School/College/Institution Type: <Text style={{ color: "red" }}>*</Text> </Text>
                                <Picker
                                    selectedValue={props.values.SchoolType}
                                    style={globalStyles.dropDown}
                                    onValueChange={(SchoolType) => props.setFieldValue('SchoolType', SchoolType)}
                                >
                                    <Picker.Item color='grey' label="Select SchoolType" value="" />
                                    {global.schooltype.map((item) => {
                                        return <Picker.Item key={item.schoolTypeID} label={item.schoolType} value={item.schoolTypeID} />
                                    })}

                                </Picker>
                                <Text style={globalStyles.errormsg}>{props.touched.SchoolType && props.errors.SchoolType}</Text>

                                {/*School Place*/}
                                <Text style={globalStyles.label}>School/College/Institution Place: <Text style={{ color: "red" }}>*</Text> </Text>
                                <TextInput
                                    style={globalStyles.input}
                                    onChangeText={props.handleChange('SchoolPlace')}
                                    value={props.values.SchoolPlace}
                                />
                                <Text style={globalStyles.errormsg}>{props.touched.SchoolPlace && props.errors.SchoolPlace}</Text>

                                {/*Starting Date*/}
                                <Text style={globalStyles.label}>Starting Date:  <Text style={{ color: "red" }}>*</Text> </Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style={globalStyles.inputText, globalStyles.dobValue}
                                        value={this.state.startingdate}
                                        editable={true}
                                        onValueChange={props.handleChange('StartingDate')}
                                    />
                                    <TouchableHighlight onPress={this.showSDDatepicker}>
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
                                            onChange={(e, date) => this._pickStartDate(e, date, props.handleChange('StartingDate'))}
                                        />
                                    }
                                </View>
                                <Text style={globalStyles.errormsg}>{props.touched.StartingDate && props.errors.StartingDate}</Text>

                                {/*Ending Date*/}
                                <Text style={globalStyles.label}>Ending Date:</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style={globalStyles.inputText, globalStyles.dobValue}
                                        value={this.state.endingdate}
                                        editable={false}
                                        onValueChange={props.handleChange('EndingDate')}
                                    />
                                    <TouchableHighlight onPress={this.showEDDatepicker}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn} name="calendar" />
                                        </View>
                                    </TouchableHighlight>
                                    {this.state.showED &&
                                        <DateTimePicker
                                            style={{ width: 100 }}
                                            mode="date" //The enum of date, datetime and time
                                            value={new Date()}
                                            mode={'date'}
                                            onChange={(e, date) => this._pickEndDate(e, date, props.handleChange('EndingDate'))}
                                        />
                                    }
                                </View>
                                <Text></Text>

                                {/*Child Stay Type*/}
                                <Text style={globalStyles.label}>Child Stay Type:</Text>
                                <Picker
                                    selectedValue={props.values.ChildStayType}
                                    style={globalStyles.dropDown}
                                    onValueChange={(ChildStayType) => props.setFieldValue('ChildStayType', ChildStayType)}
                                >
                                    <Picker.Item color='grey' label="Select Child Stay Type" value="" />
                                    {global.childstaytype.map((item) => {
                                        return <Picker.Item key={item.id} label={item.description} value={item.id} />
                                    })}
                                </Picker>
                                <Text></Text>

                                {/*Bridge course after school*/}
                                <Text style={globalStyles.label}>Bridge course after school:</Text>
                                <Picker
                                    selectedValue={props.values.BridgeCourse}
                                    style={globalStyles.dropDown}
                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('BridgeCourse', itemValue)
                                        if (itemValue == 'Yes') {
                                            this.setState({ showElements: true })
                                        } else {
                                            this.setState({ showElements: false })
                                        }
                                    }}

                                    value={props.values.childStatus}>
                                    <Picker.Item color='grey' label="Select Bridge Course" value="" />
                                    <Picker.Item label="Yes" value="Yes" />
                                    <Picker.Item label="No" value="No" />
                                </Picker>
                                <Text></Text>

                                {/*Choosing between bridge course school name and class details*/}
                                {this.state.showElements ? <View>
                                    <Text style={globalStyles.label}>Bridge Course School Name:</Text>
                                    <Picker
                                        selectedValue={props.values.BridgeCourseSchoolName}
                                        style={globalStyles.dropDown}
                                        onValueChange={props.handleChange('BridgeCourseSchoolName')}
                                    >
                                        <Picker.Item color='grey' label="Select Bridge Course School Name" value="" />
                                        <Picker.Item label="Rainbow" value="Rainbow" />
                                        <Picker.Item label="Sneha Ghar" value="Sneha Ghar" />

                                    </Picker>
                                </View> :
                                    <View>
                                        <Text style={globalStyles.label}>Class details:</Text>
                                        <TextInput
                                            style={globalStyles.input}
                                            onChangeText={props.handleChange('CDetail')}
                                            value={props.values.VPCDetail}
                                        />
                                    </View>
                                }
                                <Text></Text>

                                {/*Scholarship/Sponsorship*/}
                                <Text style={globalStyles.label}>Scholarship/Sponsorship:</Text>
                                <Picker
                                    selectedValue={props.values.ScholarshipSponsorship}
                                    style={globalStyles.dropDown}
                                    onValueChange={(itemValue, itemIndex) => {
                                        props.setFieldValue('ScholarshipSponsorship', itemValue)
                                        if (itemValue == 'Yes') {
                                            this.setState({ showSSElements: true })
                                        } else {
                                            this.setState({ showSSElements: false })
                                        }
                                    }}

                                    value={props.values.ScholarshipSponsorship}>
                                    <Picker.Item color='grey' label="Select Scholarship/Sponsorship" value="" />
                                    <Picker.Item label="Yes" value="Yes" />
                                    <Picker.Item label="No" value="No" />

                                </Picker>
                                <Text></Text>

                                {/*Scholorship Type if scholorship is yes*/}
                                {this.state.showSSElements ? <View>
                                    <Text style={globalStyles.label}>Scholorship Type:</Text>

                                    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                        {global.scholorshiptype.map((item) => {
                                            return <CheckBox
                                                style={{ flex: 1, padding: 10 }}
                                                onClick={() => {
                                                    let arr = this.state.scholoshiptype
                                                    if (arr.indexOf(item.id) == -1) {
                                                        arr.push(item.id)
                                                    } else {
                                                        arr.splice(arr.indexOf(item.id), 1)
                                                    }
                                                    this.setState({ scholorshiptype: arr })
                                                }}
                                                key={item.id}
                                                leftText={item.description}
                                                isChecked={this.state.scholoshiptype.indexOf(item.id) !== -1}
                                            />
                                        })}
                                    </View>
                                </View>
                                    : null}


                                {/*Literacy status*/}
                                <Text style={globalStyles.label}>Literacy Status:</Text>

                                {/*First Generation Learner*/}
                                <Text style={globalStyles.label}>First Generation Learner:</Text>
                                <Picker
                                    selectedValue={props.values.FirstGenLearner}
                                    style={globalStyles.dropDown}
                                    onValueChange={(FirstGenLearner) => props.setFieldValue('FirstGenLearner', FirstGenLearner)}
                                    value={props.values.FirstGenLearner}
                                >
                                    <Picker.Item color='grey' label="Select" value="" />
                                    <Picker.Item label="Yes" value="Yes" />
                                    <Picker.Item label="No" value="No" />
                                </Picker>

                                <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>

                )}

            </Formik>
            <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                <View style={globalStyles.MainContainer}>
                    <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                    <SuccessDisplay successDisplay={this.state.successDisplay} type='Status' childNo={this.state.child.firstName} />
                </View>
            </Modal>
            <LoadingDisplay loading={this.state.loading} />

        </View >
        );
    }
}


