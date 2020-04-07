import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView, KeyboardAvoidingView, Field, StyleSheet, Dimensions
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/samplestyles';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const EducationFormSchema = yup.object({
    //Class: yup.string().required(),
    //Medium: yup.string().required(),
    // SchoolName: yup.string().required(),
    // SchoolPlace: yup.string().required()
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
            "sponsorship": values.ScholarshipSponsorship
            //"spnsorshipFor": values.ScholarshipSponsorship,

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
            console.log(error, 'ffff');
            this.setState({ errorDisplay: true });

        });

    }
    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        // params.refreshChildList();

    }
    render() {
        return (<View style={globalStyles.container1}>
            <Text> Child Name: {this.state.child.firstName}</Text>
            <View style={globalStyles.container}>
                <Formik
                    initialValues={
                        {
                            Class: '',
                            Medium: '',
                            SchoolName: 'name',
                            SchoolType: '',
                            SchoolPlace: '',
                            StartingDate: this.state.startingdate,
                            EndingDate: this.state.endingdate,
                            ChildStayType: '',
                            BridgeCourse: '',
                            CDetail: '',
                            BridgeCourseSchoolName: '',
                            ScholarshipSponsorship: '',
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
                            <ScrollView>

                                <View>
                                    <Text style={globalStyles.text}>Class:</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Class && props.errors.Class}</Text>
                                    <Picker
                                        selectedValue={props.values.Class}
                                        style={globalStyles.dropDown}
                                        onValueChange={(Class) => props.setFieldValue('Class', Class)}
                                        value={props.values.Class}
                                    >
                                        <Picker.Item label="Select Class" value="" />
                                        {global.studyingclass.map((item) => {
                                            return <Picker.Item key={item.studyingclass} label={item.studyingclass} value={item.studyingclassID} />
                                        })}

                                    </Picker>
                                    <Text style={globalStyles.text}>Medium:</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Medium && props.errors.Medium}</Text>
                                    <Picker
                                        selectedValue={props.values.Medium}
                                        style={globalStyles.dropDown}
                                        onValueChange={(Medium) => props.setFieldValue('Medium', Medium)}
                                        value={props.values.Medium}
                                    >
                                        <Picker.Item label="Select Medium" value="" />
                                        {global.medium.map((item) => {
                                            return <Picker.Item key={item.motherTongueId} label={item.motherTongue} value={item.motherTongueId} />
                                        })}

                                    </Picker>
                                    <Text style={globalStyles.text}>School Name:</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Class && props.errors.SchoolName}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('SchoolName')}
                                        value={props.values.SchoolName}
                                    />
                                    <Text style={globalStyles.text}>School Type</Text>
                                    <Picker
                                        selectedValue={props.values.SchoolType}
                                        style={globalStyles.dropDown}
                                        onValueChange={(SchoolType) => props.setFieldValue('SchoolType', SchoolType)}
                                    >
                                        <Picker.Item label="Select SchoolType" value="" />
                                        {global.schooltype.map((item) => {
                                            return <Picker.Item key={item.schoolTypeID} label={item.schoolType} value={item.schoolTypeID} />
                                        })}

                                    </Picker>
                                    <Text style={globalStyles.text}>School Place:</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Class && props.errors.SchoolPlace}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('SchoolPlace')}
                                        value={props.values.SchoolPlace}
                                    />
                                    <Text style={globalStyles.text}>Starting Date:</Text>
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
                                        <Text style={globalStyles.errormsg}>{props.touched.StartingDate && props.errors.StartingDate}</Text>
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
                                    <Text style={globalStyles.text}>Ending Date:</Text>
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
                                        <Text style={globalStyles.errormsg}>{props.touched.EndingDate && props.errors.EndingDate}</Text>
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
                                    <Text style={globalStyles.text}>Child Stay Type:</Text>
                                    <Picker
                                        selectedValue={props.values.ChildStayType}
                                        style={globalStyles.dropDown}
                                        onValueChange={props.handleChange('ChildStayType')}
                                    >
                                        <Picker.Item label="Select Child Stay Type" value="" />
                                        <Picker.Item label="RH/SG" value="RH/SG" />
                                        <Picker.Item label="Other Residential Hostel" value="Other Residential Hostel" />
                                        <Picker.Item label="Day Scholar (With parents)" value="Day Scholar (With parents)" />

                                    </Picker>

                                    <Text style={globalStyles.text}>Bridge course after school:</Text>
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
                                        <Picker.Item label="Select Bridge Course" value="" />
                                        <Picker.Item label="Yes" value="Yes" />
                                        <Picker.Item label="No" value="No" />

                                    </Picker>
                                    {this.state.showElements ? null :
                                        <View>
                                            <Text style={globalStyles.text}>Class details:</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                onChangeText={props.handleChange('CDetail')}
                                                value={props.values.VPCDetail}
                                            />
                                        </View>
                                    }

                                    {this.state.showElements ?
                                        <View>
                                            <Text style={globalStyles.text}>Bridge Course School Name:</Text>
                                            <Picker
                                                selectedValue={props.values.BridgeCourseSchoolName}
                                                style={globalStyles.dropDown}
                                                onValueChange={props.handleChange('BridgeCourseSchoolName')}
                                            >
                                                <Picker.Item label="Select Bridge Course School Name" value="" />
                                                <Picker.Item label="Rainbow" value="Rainbow" />
                                                <Picker.Item label="Sneha Ghar" value="Sneha Ghar" />

                                            </Picker>
                                        </View>
                                        : null}
                                    <Text style={globalStyles.text}>Scholarship/Sponsorship:</Text>
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
                                        <Picker.Item label="Select Scholarship/Sponsorship" value="" />
                                        <Picker.Item label="Yes" value="Yes" />
                                        <Picker.Item label="No" value="No" />

                                    </Picker>

                                    {this.state.showSSElements ?
                                        <View>
                                            <CheckBox
                                                style={{ flex: 1, padding: 10 }}
                                                onClick={() => {
                                                    this.setState({
                                                        isEducation: !this.state.isEducation
                                                    })
                                                }}
                                                isChecked={this.state.isEducation}
                                                leftText={"Education"}
                                            />
                                            <CheckBox
                                                style={{ flex: 1, padding: 10 }}
                                                onClick={() => {
                                                    this.setState({
                                                        isHealth: !this.state.isHealth
                                                    })
                                                }}
                                                isChecked={this.state.isHealth}
                                                leftText={"Health"}
                                            />
                                        </View>
                                        : null}


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
        </View >
        );
    }
}


