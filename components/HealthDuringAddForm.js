import React from 'react';
import {Text, View, KeyboardAvoidingView, ScrollView, Picker,
        TextInput, Button} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import {putDataAsync, base_url} from '../constants/Base'
import { ActivityIndicator } from 'react-native';

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
        this.state = {
            child: this.props.navigation.getParam('child'),
            childHealth: this.props.childHealth,
            showLoader: false,
            loaderIndex: 0
        }
    }
    _submitHealthDuringAdd(values){
        console.log(this.props.childHealth)
        console.log('******************')
        let childHealth = this.props.childHealth
        childHealth.bloodGroup = parseInt(values.bloodGroup)
        childHealth.generalHealth = values.generalHealth
        childHealth.healthDate = new Date()
        childHealth.height =  values.height
        childHealth.weight = values.weight
        childHealth.comments =  values.comments
        console.log(childHealth)
        console.log('&&&&&&&&&&&&&&&&&&&&&&&')
        fetch(base_url + '/child-health/' + childHealth.healthNo, {
            method: 'PUT',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(childHealth),
        })
        .then((response) => {console.log(response.status);return response.json()})
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully updated child with Child Number '+this.state.child.childNo});
            alert(this.state.submitAlertMessage);
            this.setState({showLoader: false,loaderIndex:0});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to update child. Plesae contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
            this.setState({showLoader: false,loaderIndex:0});
        });
    }
    render() {
        return (
            <View style = {globalStyles.container}>
                <View style={{ position: 'absolute', top:"45%",right: 0, left: 0, zIndex: this.state.loaderIndex }}>
                    <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                </View>
                <Formik
                    initialValues = {
                        {
                            bloodGroup: this.state.child.bloodGroup,
                            generalHealth: this.state.childHealth.generalHealth,
                            height: this.state.childHealth.height,
                            weight: this.state.childHealth.weight,
                            comments: this.state.childHealth.comments
                        }
                    }
                    validationSchema = {HealthDuringAddSchema}
                    onSubmit = {(values, actions) => {
                        //actions.resetForm()
                        console.log(values)
                        this.setState({showLoader: true,loaderIndex:10});
                        let result = this._submitHealthDuringAdd(values);
                        let alertMessage = this.state.submitAlertMessage;
                        //this.props.navigation.push('InfoGeneral', values)
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
                                    <Picker.Item label = 'O+' value = '0'/>
                                    <Picker.Item label = 'B+' value = '1'/>
                                    <Picker.Item label = 'AB-' value = '2'/>
                                    <Picker.Item label = 'A+' value = '3'/>
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