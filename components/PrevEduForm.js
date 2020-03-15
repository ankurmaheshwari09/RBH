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
    render() {
        return (
            <View style = {globalStyles.container}>

                <Formik
                    initialValues = {
                        {
                            dropOutReason: '',
                            yearOfStudied: '',
                            medium: '',
                            schoolName: '',
                            schoolType: '',
                            class: '',
                            schoolPlace: ''
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
                                        style = {globalStyles.dropDown}
                                        onValueChange = {props.handleChange('medium')}
                                        selectedValue = {props.values.medium}
                                        >
                                            <Picker.Item label = 'Select Meduim' value = ''/>
                                            <Picker.Item label = 'Telugu' value = 'Telugu'/>
                                            <Picker.Item label = 'Hindi' value = 'Hindi' />
                                            <Picker.Item label = 'Malyalam' value = 'Malyalam' />
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
                                        style = {globalStyles.dropDown}
                                        onValueChange = {props.handleChange('schoolType')}
                                        selectedValue = {props.values.schoolType}
                                        >
                                            <Picker.Item label = 'Select School Type' value = ''/>
                                            <Picker.Item label = 'Govt' value = 'Govt'/>
                                            <Picker.Item label = 'Private' value = 'Private' />
                                            <Picker.Item label = 'None' value = 'None' />
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