import React from 'react';
import {Text, KeyboardAvoidingView, Picker, View, ScrollView, 
    TextInput, Button, ActivityIndicator} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import moment from 'moment';
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

export default class PrevEduForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            child: this.props.navigation.getParam('child'),
            sucessDisplay: false,
            errorDisplay: false,
            loading: false,
            isVisible: false,
        }
    }

    getYear(date_to){
        return moment(date_to).format('YYYY')
    }

    getApiMethod(prevEducation){
        if('newChild' in this.props.prevEducation){
            prevEducation.modified_on = new Date()
            return UpdateApi.addData(JSON.stringify(prevEducation), 'child-education')
        }
        else{
            return UpdateApi.updateData(JSON.stringify(prevEducation), 'child-education')
        }
    }
    _submitPrevEdu(values){
        this.setState({ loading: true });

        let prevEducation = this.props.prevEducation
        prevEducation.dropoutReason = values.dropOutReason
        prevEducation.date_from = new Date(parseInt(values.yearOfStudied) - 1, 5)
        prevEducation.date_to = new Date(parseInt(values.yearOfStudied), 5)
        prevEducation.medium = values.medium,
        prevEducation.schoolName = values.schoolName,
        prevEducation.schooltype = values.schooltype,
        prevEducation.studyingclass = values.class,
        prevEducation.address = values.schoolPlace,

        this.getApiMethod(prevEducation).then((response) => {
            this.setState({ loading: false, isVisible: true });
            if(response.ok){
                response.json().then((res) => {
                    console.log(res)
                })
                this.setState({ successDisplay: true });
            }
            else{
                throw Error(response.status);
            }
            }).catch(error => {
            console.log(error, 'ffff');
            this.setState({ errorDisplay: true });
            });
    }
    render() {
        return (
            <View style = {globalStyles.scrollContainer}>
                <Formik
                    initialValues = {
                        {
                            dropoutReason: this.state.child.dropoutReason,
                            yearOfStudied: this.props.prevEducation.date_to ? this.getYear(this.props.prevEducation.date_to): '',
                            medium: this.props.prevEducation.medium,
                            schoolName: this.props.prevEducation.schoolName,
                            schooltype: this.props.prevEducation.schooltype,
                            class: this.props.prevEducation.studyingclass,
                            schoolPlace: this.props.prevEducation.address
                        }
                    }
                    validationSchema = {PrevEduSchema}
                    onSubmit = {(values, actions) => {
                        //actions.resetForm();
                        console.log(values)
                        let result = this._submitPrevEdu(values);
                        //this.props.navigation.push('InfoGeneral', values)
                    }}
                >

                    {props => (
                        <KeyboardAvoidingView behavior = "null"
                            enabled style = {globalStyles.keyboardavoid}
                            keyboardVerticalOffset = {0}>

                                <ScrollView
                                    showsVerticalScrollIndicator = {false}
                                >
                                    <View>
                                        <Text style = {globalStyles.label}>Drop Out Reason:</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('dropoutReason')}
                                        value = {props.values.dropoutReason}
                                        />
                                        <Text style = {globalStyles.errormsg}>{ props.touched.dropoutReason && props.errors.dropoutReason }</Text>

                                        <Text style = {globalStyles.label}>Year Of Studied:</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('yearOfStudied')}
                                        value = {props.values.yearOfStudied}
                                        />
                                        <Text style = {globalStyles.errormsg}>{ props.touched.yearOfStudied && props.errors.yearOfStudied }</Text>

                                        <Text style = {globalStyles.label}>Medium:</Text>
                                        <Picker
                                        selectedValue = {props.values.medium}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('medium', value)
                                        }}
                                        >
                                            <Picker.Item color = 'grey' label="Select Medium" value="" />
                                            {global.medium.map((item) => {
                                                return <Picker.Item key = {item.motherTongueId} label = {item.motherTongue} value = {item.motherTongueId}/>
                                            })}
                                    
                                        </Picker>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.medium && props.errors.medium }</Text>

                                        <Text style = {globalStyles.label}>School Name:</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('schoolName')}
                                        value = {props.values.schoolName}
                                        />
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schoolName && props.errors.schoolName }</Text>

                                        <Text style = {globalStyles.label}>School Type:</Text>
                                        <Picker
                                        selectedValue = {props.values.schooltype}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('schooltype', value)
                                        }}
                                        >
                                            <Picker.Item color = 'grey' label="Select School Type" value="" />
                                            {global.schoolType.map((item) => {
                                                return <Picker.Item key = {item.schoolTypeID} label = {item.schoolType} value = {item.schoolTypeID}/>
                                            })}
                                    
                                        </Picker>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schooltype && props.errors.schooltype }</Text>

                                        <Text style = {globalStyles.label}>Class:</Text>
                                        <Picker
                                        selectedValue = {props.values.class}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('class', value)
                                        }}
                                        >
                                            <Picker.Item color = 'grey' label="Select Class" value="" />
                                            {global.class.map((item) => {
                                                return <Picker.Item key = {item.studyingclassId} label = {item.studyingclass} value = {item.studyingclassId}/>
                                            })}
                                    
                                        </Picker>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.class && props.errors.class }</Text>

                                        <Text style = {globalStyles.label}>School Place:</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('schoolPlace')}
                                        value = {props.values.schoolPlace}
                                        />
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schoolPlace && props.errors.schoolPlace }</Text>

                                        <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                    </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Prev Edu' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />

            </View>
        );
    }
}