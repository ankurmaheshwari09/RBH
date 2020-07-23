import React from 'react';
import {
    Text, KeyboardAvoidingView, Picker, View, ScrollView,
    TextInput, Button, TouchableOpacity
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { globalStyles } from '../styles/global';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'react-native-check-box';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const PrevEduSchema = yup.object({
    dropoutReason: yup.string(),
    yearOfStudied: yup.string()
        .test('is-num', 'Year must be a valid numer', (val) => {
            return parseInt(val) <= (new Date()).getFullYear() && parseInt(val) > 0;
        }),
    medium: yup.string(),
    schoolName: yup.string(),
    schooltype: yup.string(),
    class: yup.string(),
    schoolPlace: yup.string()
})

export default class PrevEduForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

            count: 1,
            disabled: this.props.preedustatus != 1 ? ((this.props.prevEducation.schoolName == null) || (this.props.prevEducation.schoolName == 'Never Enrolled') ? true : false) : false,
            child: this.props.navigation.getParam('child'),
            sucessDisplay: false,
            errorDisplay: false,
            loading: false,
            isVisible: false,
            literacyStatus: [],
            literacy: this.props.prevEducation.literacyStatus,
        }
    }

    getYear(date_to) {
        return moment(date_to).format('YYYY')
    }

    getApiMethod(prevEducation) {
        if ('newChild' in this.props.prevEducation) {
            prevEducation.modified_on = new Date()
            return UpdateApi.addData(JSON.stringify(prevEducation), 'child-education')
        }
        else {
            return UpdateApi.updateData(JSON.stringify(prevEducation), 'child-education')
        }
    }
    _submitPrevEdu(values) {
        this.setState({ loading: true });

        let prevEducation = this.props.prevEducation
        prevEducation.dropoutReason = values.dropoutReason,
            prevEducation.date_from = new Date(parseInt(values.yearOfStudied) - 1, 5),
            prevEducation.date_to = new Date(parseInt(values.yearOfStudied), 5),
            prevEducation.medium = values.medium,
            prevEducation.schoolName = values.schoolName,
            prevEducation.schooltype = values.schooltype,
            prevEducation.studyingclass = values.class,
            prevEducation.address = values.schoolPlace,
            prevEducation.literacyStatus = this.state.literacyStatus.sort().join(','),
            prevEducation.firstGenLearner = values.FirstGenLearner
        console.log(prevEducation);
        this.getApiMethod(prevEducation).then((response) => {
            this.setState({ loading: false, isVisible: true });
            if (response.ok) {
                response.json().then((res) => {
                    console.log(res)
                })
                this.setState({ successDisplay: true });
            }
            else {
                throw Error(response.status);
            }
        }).catch(error => {
            console.log(error, 'ffff');
            this.setState({ errorDisplay: true });
        });
    }
    render() {
        return (
            <View style={globalStyles.scrollContainer}>
                <Formik
                    initialValues={
                        {
                            dropoutReason: this.state.child.dropoutReason,
                            yearOfStudied: this.props.prevEducation.date_to ? this.getYear(this.props.prevEducation.date_to) : '',
                            medium: this.props.prevEducation.medium,
                            schoolName: this.props.prevEducation.schoolName,
                            schooltype: this.props.prevEducation.schooltype,
                            class: this.props.prevEducation.studyingclass,
                            schoolPlace: this.props.prevEducation.address,
                            literacyStatus: '',
                            FirstGenLearner: this.props.prevEducation.firstGenLearner,
                        }
                    }
                    validationSchema={PrevEduSchema}
                    onSubmit={(values, actions) => {
                        console.log(values)
                        let result = this._submitPrevEdu(values);
                    }}
                >

                    {props => (
                        <KeyboardAvoidingView behavior="null"
                            enabled style={globalStyles.keyboardavoid}
                            keyboardVerticalOffset={0}>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >

                                {/*Child Name*/}
                                <Text style={globalStyles.label}>Child Name:</Text>
                                <TextInput
                                    style={globalStyles.disabledBox}
                                    value={this.state.child.firstName} //value updated in 'values' is reflected here
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                                <View>
                                    {/*Drop Out Reason*/}
                                    <Text style={globalStyles.label}>Drop Out Reason: <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('dropoutReason')}
                                        value={props.values.dropoutReason}
                                        editable={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.dropoutReason && props.errors.dropoutReason}</Text>

                                    {/*Year Of Studied*/}
                                    <Text style={globalStyles.label}>Year Of Studied: <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('yearOfStudied')}
                                        value={props.values.yearOfStudied}
                                        editable={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.yearOfStudied && props.errors.yearOfStudied}</Text>
                                    {/*Medium*/}
                                    <Text style={globalStyles.label}>Medium: <Text style={{ color: "red" }}>*</Text></Text>
                                    <Picker
                                        selectedValue={props.values.medium}
                                        style={globalStyles.dropDown}
                                        onValueChange={value => {
                                            props.setFieldValue('medium', value)
                                        }}
                                        enabled={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    >
                                        <Picker.Item color='grey' label="Select Medium" value="" />
                                        {global.medium.map((item) => {
                                            return <Picker.Item key={item.motherTongueId} label={item.motherTongue} value={item.motherTongueId} />
                                        })}

                                    </Picker>

                                    {/*School Name*/}
                                    <Text style={globalStyles.errormsg}>{props.touched.medium && props.errors.medium}</Text>

                                    <Text style={globalStyles.label}>School Name: <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('schoolName')}
                                        value={props.values.schoolName}
                                        editable={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.schoolName && props.errors.schoolName}</Text>


                                    {/*School Type*/}
                                    <Text style={globalStyles.label}>School Type: <Text style={{ color: "red" }}>*</Text></Text>
                                    <Picker
                                        selectedValue={props.values.schooltype}
                                        style={globalStyles.dropDown}
                                        onValueChange={value => {
                                            props.setFieldValue('schooltype', value)
                                        }}
                                        enabled={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    >
                                        <Picker.Item color='grey' label="Select School Type" value="" />
                                        {global.schoolType.map((item) => {
                                            return <Picker.Item key={item.schoolTypeID} label={item.schoolType} value={item.schoolTypeID} />
                                        })}

                                    </Picker>
                                    <Text style={globalStyles.errormsg}>{props.touched.schooltype && props.errors.schooltype}</Text>
                                    {/*Class*/}
                                    <Text style={globalStyles.label}>Class <Text style={{ color: "red" }}>*</Text>:</Text>
                                    <Picker
                                        selectedValue={props.values.class}
                                        style={globalStyles.dropDown}
                                        onValueChange={value => {
                                            props.setFieldValue('class', value)
                                        }}
                                        enabled={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    >
                                        <Picker.Item color='grey' label="Select Class" value="" />
                                        {global.class.map((item) => {
                                            return <Picker.Item key={item.studyingclassId} label={item.studyingclass} value={item.studyingclassId} />
                                        })}

                                    </Picker>
                                    <Text style={globalStyles.errormsg}>{props.touched.class && props.errors.class}</Text>

                                    {/*School Place*/}
                                    <Text style={globalStyles.label}>School Place: <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('schoolPlace')}
                                        value={props.values.schoolPlace}
                                        editable={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.schoolPlace && props.errors.schoolPlace}</Text>

                                    {/*Literacy status*/}
                                    <View>
                                        <Text style={globalStyles.label}>Literacy status:</Text>

                                        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                            {global.literacyStatus.map((item) => {
                                                return <CheckBox
                                                    style={{ flex: 1, padding: 10 }}
                                                    onClick={() => {
                                                        let arr = this.state.literacyStatus
                                                        if (arr.indexOf(item.id) == -1) {
                                                            arr.push(item.id)
                                                        } else {
                                                            arr.splice(arr.indexOf(item.id), 1)
                                                        } this.state.count = this.state.count + 1;
                                                        this.setState({ literacyStatus: arr }); console.log()
                                                    }}

                                                    key={item.id}
                                                    leftText={item.description}
                                                    isChecked={this.state.count == 1 ? this.state.literacy.indexOf(item.id) !== -1 :
                                                        this.state.literacyStatus.indexOf(item.id) !== -1}
                                                    disabled={!this.state.disabled}

                                                />
                                            })}
                                        </View>
                                    </View>

                                    {console.log(this.state.disabled)}
                                    {/*First Generation Learner*/}
                                    <Text style={globalStyles.label}>First Generation Learner:</Text>
                                    <Picker
                                        selectedValue={props.values.FirstGenLearner}
                                        style={globalStyles.dropDown}
                                        onValueChange={(FirstGenLearner) => props.setFieldValue('FirstGenLearner', FirstGenLearner)}
                                        value={props.values.FirstGenLearner}
                                        enabled={this.state.disabled}
                                        selectTextOnFocus={this.state.disabled}
                                    >
                                        <Picker.Item color='grey' label="Select" value="" />
                                        <Picker.Item label="Yes" value="Yes" />
                                        <Picker.Item label="No" value="No" />
                                    </Picker>
                                    <Text></Text>
                                    <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
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
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Previous Education' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />

            </View>
        );
    }
}