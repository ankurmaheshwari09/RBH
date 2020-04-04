import React from 'react';
import {Text, KeyboardAvoidingView, Picker, View, ScrollView, TextInput, Button} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';

const PrevEduSchema = yup.object({
    dropOutReason: yup.string(),
    yearOfStudied: yup.string()
        .test('is-num', 'Year must be a valid numer', (val) => {
            return parseInt(val) <= (new Date()).getFullYear() && parseInt(val) > 0;
        }),
    medium: yup.string(),
    schoolName: yup.string(),
    cchoolType: yup.string(),
    class: yup.string(),
    schoolPlace: yup.string()
})

export default class PrevEduForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            child: this.props.navigation.getParam('child')
        }
    }
    render() {
        return (
            <View style = {globalStyles.container}>

                <Formik
                    initialValues = {
                        {
                            dropOutReason: '',//this.state.child.dropOutReason
                            yearOfStudied: '',
                            medium: this.props.prevEducation.medium,
                            schoolName: this.props.prevEducation.schoolName,
                            schoolType: this.props.prevEducation.schoolType,
                            class: this.state.child.previousClassStudied,
                            schoolPlace: this.props.prevEducation.address
                        }
                    }
                    validationSchema = {PrevEduSchema}
                    onSubmit = {(values, actions) => {
                        actions.resetForm();
                        console.log(values)
                        this.props.navigation.push('InfoGeneral', values)
                    }}
                >

                    {props => (
                        <KeyboardAvoidingView behavior = "padding"
                            enabled style = {globalStyles.keyboardavoid}
                            keyboardVerticalOffset = {150}>

                                <ScrollView
                                    showsVerticalScrollIndicator = {false}
                                >
                                    <View>
                                        <Text style = {globalStyles.text}>Drop Out Reason</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.dropOutReason && props.errors.dropOutReason }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('dropOutReason')}
                                        value = {props.values.dropOutReason}
                                        />

                                        <Text style = {globalStyles.text}>Year Of Studied</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.yearOfStudied && props.errors.yearOfStudied }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('yearOfStudied')}
                                        value = {props.values.yearOfStudied}
                                        />

                                        <Text style = {globalStyles.text}>Medium</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.medium && props.errors.medium }</Text>
                                        <Picker
                                        selectedValue = {props.values.medium}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('medium', value)
                                        }}
                                        >
                                            <Picker.Item label="Select Medium" value="" />
                                            {global.medium.map((item) => {
                                                return <Picker.Item key = {item.motherTongueId} label = {item.motherTongue} value = {item.motherTongueId}/>
                                            })}
                                    
                                        </Picker>

                                        <Text style = {globalStyles.text}>School Name</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schoolName && props.errors.schoolName }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('schoolName')}
                                        value = {props.values.schoolName}
                                        />

                                        <Text style = {globalStyles.text}>School Type</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schoolType && props.errors.schoolType }</Text>
                                        <Picker
                                        selectedValue = {props.values.schoolType}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('schoolType', value)
                                        }}
                                        >
                                            <Picker.Item label="Select School Type" value="" />
                                            {global.schoolType.map((item) => {
                                                return <Picker.Item key = {item.schoolTypeID} label = {item.schoolType} value = {item.schoolTypeID}/>
                                            })}
                                    
                                        </Picker>

                                        <Text style = {globalStyles.text}>Class</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.class && props.errors.class }</Text>
                                        <Picker
                                        style = {globalStyles.dropDown}
                                        onValueChange = {props.handleChange('class')}
                                        selectedValue = {props.values.class}
                                        >
                                            <Picker.Item label = 'Select Class' value = ''/>
                                            <Picker.Item label = 'I' value = 'I'/>
                                            <Picker.Item label = 'II' value = 'II' />
                                            <Picker.Item label = 'III' value = 'III' />
                                        </Picker>
                                        {/* <Picker
                                        selectedValue = {props.values.class}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('class', value)
                                        }}
                                        >
                                            <Picker.Item label="Select Class" value="" />
                                            {global.class.map((item) => {
                                                return <Picker.Item key = {item.studyingclassId} label = {item.status} value = {item.studyingclassId}/>
                                            })}
                                    
                                        </Picker> */}

                                        <Text style = {globalStyles.text}>School Place</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schoolPlace && props.errors.schoolPlace }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('schoolPlace')}
                                        value = {props.values.schoolPlace}
                                        />
                                        <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                    </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                    )}

                </Formik>

            </View>
        );
    }
}