import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView} from 'react-native';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';

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
            child: this.props.navigation.getParam('child')
        }
        console.log('ASDFGFGHVBNMTYU')
        console.log(this.state.child)
    }
    render() {
        return (
            
            <View style = {globalStyles.container}>

                <Formik
                enableReinitialize
                initialValues = {
                    {
                        identificationPlace1 : parseInt(this.state.child.identificationMark1.split(',')[0]), 
                        markType1: parseInt(this.state.child.identificationMark1.split(',')[1]), 
                        identificationPlace2 : parseInt(this.state.child.identificationMark2.split(',')[0]), 
                        markType2: parseInt(this.state.child.identificationMark2.split(',')[1]), 
                        specialNeed: this.state.child.differentlyAbledGroup,
                        occupationOnStreet: this.state.child.occupation,
                        durationOnStreet: '',//duration
                        psoName: '',//OrganizationName
                        cwcRefNo: '',//CWCRefNo
                        cwcStayReason: this.state.child.stayReason
                    }
                }
                validationSchema = {GeneralInfoFormSchema}
                onSubmit = {(values, actions) => {
                    actions.resetForm();
                    console.log(values);
                    alert("Data Has been submitted")
                    this.props.navigation.push('InfoGeneral', values)
                    
                }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior="padding" 
                            enabled style={globalStyles.keyboardavoid} 
                            keyboardVerticalOffset={200}>
                        <ScrollView
                            showsVerticalScrollIndicator = {false}
                        >
                            
                            <View>
                                
                                <Text style = {globalStyles.text}>IdentificationPlace 1</Text>
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
                                
                                <Text style = {globalStyles.text}>MarkType1</Text>
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

                                <Text style = {globalStyles.text}>IdentificationPlace2</Text>
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

                                <Text style = {globalStyles.text}>MarkType2</Text>
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

                                <Text style = {globalStyles.text}>Special Need</Text>
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

                                <Text style = {globalStyles.text}>Occupation On Street</Text>
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

                                <Text style = {globalStyles.text}>Duration On Street</Text>
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

                                <Text style = {globalStyles.text}>CWC Reference No</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('cwcRefNo')}
                                    value = {props.values.cwcRefNo}
                                />

                                <Text style = {globalStyles.text}>CWC Stay Reason</Text>
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

            </View>
        );
    }
}