import React from 'react';
import {Text, View, KeyboardAvoidingView, ScrollView, Picker,
        TextInput, Button} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import {base_url} from '../constants/Base'
import { ActivityIndicator } from 'react-native';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const HealthDuringAddSchema = yup.object({
    bloodGroup: yup.string(),
    generalHealth: yup.string(),
    height: yup.number()
        .test('is-height-valid', 'Enter a valid height', (height) => {
            return height !== undefined && parseFloat(height) > 0;
        }),
    weight: yup.number()
        .test('is-weight-valid', 'Enter a valid weight', (weight) => {
            return weight !== undefined && parseFloat(weight) > 0;
        }),
    comments: yup.string()
})

export default class HealthDuringAdd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            child: this.props.navigation.getParam('child'),
            childHealth: this.props.childHealth,
            sucessDisplay: false,
            errorDisplay: false,
            loading: false,
            isVisible: false,
        }
        console.log(this.state.childHealth)
    }
    getApiMethod(childHealth){
        if('newChild' in this.props.childHealth){
            childHealth.healthDate = new Date()
            return UpdateApi.addData(JSON.stringify(childHealth), 'child-health')
        }
        else{
            return UpdateApi.updateData(JSON.stringify(childHealth), `child-health/${childHealth.healthNo}`)
        }
    }
    _submitHealthDuringAdd(values){
        this.setState({ loading: true });

        let childHealth = this.props.childHealth
        childHealth.bloodGroup = parseInt(values.bloodGroup)
        childHealth.generalHealth = values.generalHealth
        childHealth.height =  values.height
        childHealth.weight = values.weight
        childHealth.comments =  values.comments

        this.getApiMethod(childHealth).then((response) => {
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
                            bloodGroup: this.state.child.bloodGroup ? this.state.child.bloodGroup.toString() : '',
                            generalHealth: this.state.childHealth.generalHealth ? this.state.childHealth.generalHealth : '',
                            height: this.state.childHealth.height ? this.state.childHealth.height : '',
                            weight: this.state.childHealth.weight ? this.state.childHealth.weight : '',
                            comments: this.state.childHealth.comments ? this.state.childHealth.comments : ''
                        }
                    }
                    validationSchema = {HealthDuringAddSchema}
                    onSubmit = {(values, actions) => {
                        console.log(values)
                        this.setState({showLoader: true,loaderIndex:10});
                        let result = this._submitHealthDuringAdd(values);
                        let alertMessage = this.state.submitAlertMessage;
                    }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior = "null"
                            enabled style = {globalStyles.keyboardavoid}
                            keyboardVerticalOffset = {0}
                        >
                        <ScrollView
                            showsVerticalScrollIndicator = {false}
                        >
                            <View>
                                <Text style = {globalStyles.label}>Blood Group:</Text>
                                <Picker style = {globalStyles.dropDown}
                                onValueChange = {props.handleChange('bloodGroup')}
                                selectedValue = {props.values.bloodGroup}
                                >
                                    <Picker.Item label = 'Select Blood Group' value = '0'/>
                                    <Picker.Item label = 'O+' value = "1"/>
                                    <Picker.Item label = 'B+' value = "2"/>
                                    <Picker.Item label = 'AB-' value = "3"/>
                                    <Picker.Item label = 'A+' value = "4"/>
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.bloodGroup && props.errors.bloodGroup}</Text>

                                <Text style = {globalStyles.label}>General Health:</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.generalHealth && props.errors.generalHealth}</Text>

                                <Text style = {globalStyles.label}>Height:</Text>
                                <TextInput style = {globalStyles.inputText}
                                onChangeText = {props.handleChange('height')}
                                value = {props.values.height}
                                placeholder = 'Enter height in cm'
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.height && props.errors.height}</Text>

                                <Text style = {globalStyles.label}>Weight:</Text>
                                <TextInput style = {globalStyles.inputText}
                                onChangeText = {props.handleChange('weight')}
                                value = {props.values.weight}
                                placeholder = 'Enter weight in kg'
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.weight && props.errors.weight}</Text>
                                <Text style = {globalStyles.label}>Comments:</Text>
                                <TextInput style = {globalStyles.inputText}
                                onChangeText = {props.handleChange('comments')}
                                value = {props.values.comments}
                                multiline = {true}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.comments && props.errors.comments}</Text>

                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                            </View>
                        </ScrollView>

                    </KeyboardAvoidingView>

                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Health' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}