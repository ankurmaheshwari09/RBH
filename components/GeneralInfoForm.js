import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';
import {putDataAsync, base_url} from '../constants/Base';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import { containerCSS } from 'react-select/src/components/containers';
import { Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';
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
    cwcStayReason: yup.string(),
    abuseOnStreet: yup.string(),
    aadharNumber: yup.string()
    // .test('is-aadharNumber-valid', 'Enter a valid input', (aadharNumber) => {
    //     return aadharNumber !== undefined && parseFloat(aadharNumber) > 0;
    // })
    .matches('^[0-9]{12}$', 'Enter Valid Aadhar number'),
    noOfTimesLeavingHome: yup.string()
})

export default class GeneralInfoForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            child: this.props.childData,
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
        child.abuseOnStreet = values.abuseOnStreet
        child.aadharNumber = parseInt(values.aadharNumber)
        child.noOfTimesLeavingHome = values.noOfTimesLeavingHome
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
            
            <View style = {globalStyles.scrollContainer}>
                
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
                        cwcStayReason: this.state.child.stayReason ? this.state.child.stayReason : '',
                        abuseOnStreet: this.state.child.abuseOnStreet ? this.state.child.abuseOnStreet : '',
                        aadharNumber : this.state.child.aadharNumber ? this.state.child.aadharNumber : '',
                        noOfTimesLeavingHome : this.state.child.noOfTimesLeavingHome ? this.state.child.noOfTimesLeavingHome : ''
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
                                
                                <Text style = {globalStyles.label}>Aadhar Number:</Text>
                                <TextInput
                                    keyboardType = 'numeric'
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('aadharNumber')} 
                                    value = {`${props.values.aadharNumber}`}
                                    maxLength = {12}
                                />
                                <Text style = {globalStyles.errormsg}>{ props.touched.aadharNumber && props.errors.aadharNumber }</Text>

                                <Text style = {globalStyles.label}>IdentificationPlace 1<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                selectedValue = {props.values.identificationPlace1}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('identificationPlace1', value)
                                }}
                                >
                                    <Picker.Item color = 'grey' label="Select Identification" value = "0"/>
                                    {global.identification.map((item) => {
                                        return <Picker.Item key = {item.identificationId} label = {item.identification} value = {item.identificationId}/>
                                    })}
                                    
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{ props.touched.identificationPlace1 && props.errors.identificationPlace1 }</Text>

                                <Text style = {globalStyles.label}>MarkType1<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                selectedValue = {props.values.markType1}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('markType1', value)
                                }}
                                enabled = {props.values.identificationPlace1 == '0' ? false : true}
                                >
                                    <Picker.Item color = 'grey' label="Select MarkType" value="0" />
                                    {global.markTypes.map((item) => {
                                        return <Picker.Item key = {item.markTypeId} label = {item.markType} value = {item.markTypeId}/>
                                    })}
                                    
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{ props.touched.markType1 && props.errors.markType1 }</Text>

                                <Text style = {globalStyles.label}>IdentificationPlace2:</Text>
                                <Picker
                                selectedValue = {props.values.identificationPlace2}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('identificationPlace2', value)
                                }}
                                >
                                    <Picker.Item color = 'grey' label="Select Identification" value="0" />
                                    {global.identification.map((item) => {
                                        return <Picker.Item key = {item.identificationId} label = {item.identification} value = {item.identificationId}/>
                                    })}
                                    
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{ props.touched.identificationPlace2 && props.errors.identificationPlace2}</Text>

                                <Text style = {globalStyles.label}>MarkType2:</Text>
                                <Picker
                                selectedValue = {props.values.markType2}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('markType2', value)
                                }}
                                enabled = {props.values.identificationPlace2 == '0' ? false : true}
                                >
                                    <Picker.Item color = 'grey' label="Select MarkType" value="0" />
                                    {global.markTypes.map((item) => {
                                        return <Picker.Item key = {item.markTypeId} label = {item.markType} value = {item.markTypeId}/>
                                    })}
                                    
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{ props.touched.markType2 && props.errors.markType2}</Text>

                                <Text style = {globalStyles.label}>Special Need:</Text>
                                <Picker
                                selectedValue = {props.values.specialNeed}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('specialNeed', value)
                                }}
                                >
                                    <Picker.Item color = 'grey' label="Select Differently Abled Group" value="0" />
                                    {global.specialNeed.map((item) => {
                                        return <Picker.Item key = {item.differentlyAbledGroupId} label = {item.differentlyAbledGroup} value = {item.differentlyAbledGroupId}/>
                                    })}
                                    
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{ props.touched.specialNeed && props.errors.specialNeed }</Text>

                                <Text style = {globalStyles.label}>Occupation On Street:</Text>
                                <Picker
                                selectedValue = {props.values.occupationOnStreet}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('occupationOnStreet', value)
                                }}
                                >
                                    <Picker.Item color = 'grey' label="Select Occupation" value="0" />
                                    {global.occupation.map((item) => {
                                        return <Picker.Item key = {item.occupationNo} label = {item.occupation} value = {item.occupationNo}/>
                                    })}
                                    
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{ props.touched.occupationOnStreet && props.errors.occupationOnStreet }</Text>

                                <Text style = {globalStyles.label}>Duration On Street:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('durationOnStreet')} //This will update the IdentificationMArk value in 'values'
                                    value = {props.values.durationOnStreet} //value updated in 'values' is reflected here
                                />
                                <Text style = {globalStyles.errormsg}>{ props.touched.durationOnStreet && props.errors.durationOnStreet }</Text>

                                <Text style = {globalStyles.label}>Abuse On Street/Working place:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('abuseOnStreet')} //This will update the IdentificationMArk value in 'values'
                                    value = {props.values.abuseOnStreet} //value updated in 'values' is reflected here
                                />
                                <Text style = {globalStyles.errormsg}>{ props.touched.abuseOnStreet && props.errors.abuseOnStreet }</Text>

                                <Text style = {globalStyles.label}>Previously Stayed Organisation Name:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('psoName')}
                                    value = {props.values.psoName}
                                />
                                <Text style = {globalStyles.errormsg}>{ props.touched.psoName && props.errors.psoName }</Text>

                                <Text style = {globalStyles.label}>No.of time leaving home:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('noOfTimesLeavingHome')} 
                                    value = {props.values.noOfTimesLeavingHome}
                                />
                                <Text style = {globalStyles.errormsg}>{ props.touched.noOfTimesLeavingHome && props.errors.noOfTimesLeavingHome }</Text>

                                <Text style = {globalStyles.label}>CWC Reference No:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('cwcRefNo')}
                                    value = {props.values.cwcRefNo}
                                />
                                <Text style = {globalStyles.errormsg}>{ props.touched.cwcRefNo && props.errors.cwcRefNo }</Text>

                                <Text style = {globalStyles.label}>CWC Stay Reason:</Text>
                                <Picker
                                selectedValue = {props.values.cwcStayReason}
                                style = {globalStyles.dropDown}
                                onValueChange = {value => {
                                    props.setFieldValue('cwcStayReason', value)
                                }}
                                >
                                    <Picker.Item color = 'grey' label="CWC Stay Reason" value="" />
                                    {global.cwcStayReason.map((item) => {
                                        return <Picker.Item key = {item.stayReasonId} label = {item.stayReason} value = {item.stayReasonId}/>
                                    })}
                                    
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{ props.touched.cwcStayReason && props.errors.cwcStayReason }</Text>
                                
                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
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
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='General Info' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}