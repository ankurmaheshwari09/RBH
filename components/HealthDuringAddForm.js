import React from 'react';
import {Text, View, KeyboardAvoidingView, ScrollView, Picker,
        TextInput, Button} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';


const HealthDuringAddSchema = yup.object({
    bloodGroup: yup.string(),
    generalHealth: yup.string(),
    height: yup.string()
        .test('is-height-valid', 'Enter a valid height', (height) => {
            return height == undefined || parseFloat(height) > 0;
        }),
    weight: yup.string()
        .test('is-weight-valid', 'Enter a valid weight', (weight) => {
            return weight == undefined || parseFloat(weight) > 0;
        }),
    comments: yup.string()
})

export default class HealthDuringAdd extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style = {globalStyles.container}>
                <Formik
                    initialValues = {
                        {
                            bloodGroup: '',//
                            generalHealth: this.props.childHealth.generalHealth,
                            height: this.props.childHealth.height,
                            weight: this.props.childHealth.weight,
                            comments: this.props.childHealth.comments
                        }
                    }
                    validationSchema = {HealthDuringAddSchema}
                    onSubmit = {(values, actions) => {
                        actions.resetForm()
                        console.log(values)
                        this.props.navigation.push('InfoGeneral', values)
                    }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior = "padding"
                            enabled style = {globalStyles.keyboardavoid}
                            keyboardVerticalOffset = {150}
                        >
                        <ScrollView
                            showsVerticalScrollIndicator = {false}
                        >
                            <View>
                                <Text style = {globalStyles.text}>Blood Group</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.bloodGroup && props.errors.bloodGroup}</Text>
                                <Picker style = {globalStyles.dropDown}
                                onValueChange = {props.handleChange('bloodGroup')}
                                selectedValue = {props.values.bloodGroup}
                                >
                                    <Picker.Item label = 'Select Blood Group' value = ''/>
                                    <Picker.Item label = 'O+' value = 'O+'/>
                                    <Picker.Item label = 'B+' value = 'B+'/>
                                    <Picker.Item label = 'AB-' value = 'AB-'/>
                                    <Picker.Item label = 'A+' value = 'A+'/>
                                </Picker>

                                <Text style = {globalStyles.text}>General Helath</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.generalHealth && props.errors.generalHealth}</Text>
                                <Picker
                                selectedValue = {props.values.generalHealth}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('generalHealth', value)
                                }}
                                >
                                    <Picker.Item label="Select General Health" value="" />
                                    {global.generalHealth.map((item) => {
                                        return <Picker.Item key = {item.generalHealthID} label = {item.generalHealth} value = {item.generalHealthID}/>
                                    })}
                                    
                                </Picker>

                                <Text style = {globalStyles.text}>Height</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.height && props.errors.height}</Text>
                                <TextInput style = {globalStyles.inputText}
                                onChangeText = {props.handleChange('height')}
                                value = {props.values.height}
                                />

                                <Text style = {globalStyles.text}>Weight</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.weight && props.errors.weight}</Text>
                                <TextInput style = {globalStyles.inputText}
                                onChangeText = {props.handleChange('weight')}
                                value = {props.values.weight}
                                />

                                <Text style = {globalStyles.text}>Comments</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.comments && props.errors.comments}</Text>
                                <TextInput style = {globalStyles.inputText}
                                onChangeText = {props.handleChange('comments')}
                                value = {props.values.comments}
                                multiline = {true}
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