import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';
import {putDataAsync, base_url} from '../constants/Base';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const GeneralInfoFormSchema = yup.object({
    identificationPlace1: yup.string().required(),
    markType1: yup.string().required(),
    identificationPlace2: yup.string(),
    markType2: yup.string(),
    specialNeed: yup.string(),
    occupationOnStreet: yup.string(),
    durationOnStreet: yup.string(),
    psoName: yup.string(),
    cwcRefNo: yup.string(),
    cwcStayReason: yup.string()

})

export default class GeneralInfoForm extends React.Component{
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
    
    _submitGeneralInfo(values){
        this.setState({ loading: true });
        let child = this.props.childData
        child.identificationMark1 =  values.identificationPlace1.toString() + ',' + values.markType1.toString()
        child.identificationMark2 = values.identificationPlace2.toString() + ',' + values.markType2.toString()
        child.stayReason =  values.cwcStayReason
        child.occupation = values.occupationOnStreet
        child.differentlyAbledGroup = values.specialNeed
        child.duration = values.durationOnStreet
        child.organisationName = values.psoName
        child.cWCRefNo =  values.cwcRefNo
        child.stayReason = values.cwcStayReason
        console.log(child)
        let path = `child/${child.childNo}`
        UpdateApi.updateData(JSON.stringify(child), path).then((response) => {
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
            
            <View style = {globalStyles.container}>
                
                <Formik
                enableReinitialize
                initialValues = {
                    {
                        identificationPlace1 : this.state.child.identificationMark1 ? parseInt(this.state.child.identificationMark1.split(',')[0]) : '', 
                        markType1: this.state.child.identificationMark1 ? parseInt(this.state.child.identificationMark1.split(',')[1]): '', 
                        identificationPlace2 : this.state.child.identificationMark2 ? parseInt(this.state.child.identificationMark2.split(',')[0]) : '', 
                        markType2: this.state.child.identificationMark2 ? parseInt(this.state.child.identificationMark2.split(',')[1]) : '', 
                        specialNeed: this.state.child.differentlyAbledGroup ? this.state.child.differentlyAbledGroup : '',
                        occupationOnStreet: this.state.child.occupation ? this.state.child.occupation : '',
                        durationOnStreet: this.state.child.duration ? this.state.child.duration : '',
                        psoName: this.state.child.organisationName ? this.state.child.organisationName : '',
                        cwcRefNo: this.state.child.cWCRefNo ? this.state.child.cWCRefNo : '',
                        cwcStayReason: this.state.child.stayReason ? this.state.child.stayReason : ''
                    }
                }
                validationSchema = {GeneralInfoFormSchema}
                onSubmit = {(values, actions) => {
                    //actions.resetForm();
                    let result = this._submitGeneralInfo(values);
                    let alertMessage = this.state.submitAlertMessage;
                    //this.props.navigation.push('InfoGeneral', values)
                    
                }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior="null" 
                            enabled style={globalStyles.keyboardavoid} 
                            keyboardVerticalOffset={0}>
                        <ScrollView
                            showsVerticalScrollIndicator = {false}
                        >
                            
                            <View>
                                
                                <Text style = {globalStyles.text}>IdentificationPlace 1:</Text>
                                <Text style = {globalStyles.errormsg}>{ props.touched.identificationPlace1 && props.errors.identificationPlace1 }</Text>
                                <Picker
                                selectedValue = {props.values.identificationPlace1}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('identificationPlace1', value)
                                }}
                                >
                                    <Picker.Item label="Select Identification" value = "0"/>
                                    {global.identification.map((item) => {
                                        return <Picker.Item key = {item.identificationId} label = {item.identification} value = {item.identificationId}/>
                                    })}
                                    
                                </Picker>
                                
                                <Text style = {globalStyles.text}>MarkType1:</Text>
                                <Text style = {globalStyles.errormsg}>{ props.touched.markType1 && props.errors.markType1 }</Text>

                                <Picker
                                selectedValue = {props.values.markType1}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('markType1', value)
                                }}
                                enabled = {props.values.identificationPlace1 == '0' ? false : true}
                                >
                                    <Picker.Item  label="Select MarkType" value="0" />
                                    {global.markTypes.map((item) => {
                                        return <Picker.Item key = {item.markTypeId} label = {item.markType} value = {item.markTypeId}/>
                                    })}
                                    
                                </Picker>

                                <Text style = {globalStyles.text}>IdentificationPlace2:</Text>
                                <Picker
                                selectedValue = {props.values.identificationPlace2}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('identificationPlace2', value)
                                }}
                                >
                                    <Picker.Item label="Select Identification" value="0" />
                                    {global.identification.map((item) => {
                                        return <Picker.Item key = {item.identificationId} label = {item.identification} value = {item.identificationId}/>
                                    })}
                                    
                                </Picker>

                                <Text style = {globalStyles.text}>MarkType2:</Text>
                                <Picker
                                selectedValue = {props.values.markType2}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('markType2', value)
                                }}
                                enabled = {props.values.identificationPlace2 == '0' ? false : true}
                                >
                                    <Picker.Item label="Select MarkType" value="0" />
                                    {global.markTypes.map((item) => {
                                        return <Picker.Item key = {item.markTypeId} label = {item.markType} value = {item.markTypeId}/>
                                    })}
                                    
                                </Picker>

                                <Text style = {globalStyles.text}>Special Need:</Text>
                                <Picker
                                selectedValue = {props.values.specialNeed}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('specialNeed', value)
                                }}
                                >
                                    <Picker.Item label="Select Differently Abled Group" value="0" />
                                    {global.specialNeed.map((item) => {
                                        return <Picker.Item key = {item.differentlyAbledGroupId} label = {item.differentlyAbledGroup} value = {item.differentlyAbledGroupId}/>
                                    })}
                                    
                                </Picker>

                                <Text style = {globalStyles.text}>Occupation On Street:</Text>
                                <Picker
                                selectedValue = {props.values.occupationOnStreet}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('occupationOnStreet', value)
                                }}
                                >
                                    <Picker.Item label="Select Occupation" value="0" />
                                    {global.occupation.map((item) => {
                                        return <Picker.Item key = {item.occupationNo} label = {item.occupation} value = {item.occupationNo}/>
                                    })}
                                    
                                </Picker>

                                <Text style = {globalStyles.text}>Duration On Street:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('durationOnStreet')} //This will update the IdentificationMArk value in 'values'
                                    value = {props.values.durationOnStreet} //value updated in 'values' is reflected here
                                />
                                <Text style = {globalStyles.text}>Previously Stayed Organisation Name</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('psoName')}
                                    value = {props.values.psoName}
                                />

                                <Text style = {globalStyles.text}>CWC Reference No:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('cwcRefNo')}
                                    value = {props.values.cwcRefNo}
                                />

                                <Text style = {globalStyles.text}>CWC Stay Reason:</Text>
                                <Picker
                                selectedValue = {props.values.cwcStayReason}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('cwcStayReason', value)
                                }}
                                >
                                    <Picker.Item label="CWC Stay Reason" value="" />
                                    {global.cwcStayReason.map((item) => {
                                        return <Picker.Item key = {item.stayReasonId} label = {item.stayReason} value = {item.stayReasonId}/>
                                    })}
                                    
                                </Picker>
                                
                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                            </View>
                            </ScrollView>  
                            </KeyboardAvoidingView>
                                                  
                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='General Info' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}