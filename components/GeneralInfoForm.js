import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView} from 'react-native';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';

const GeneralInfoFormSchema = yup.object({
    IdentificationPlace1: yup.string().required(),
    MarkType1: yup.string().required(),
    IdentificationPlace2: yup.string(),
    MarkType2: yup.string(),
    SpecialNeed: yup.string(),
    OccupationOnStreet: yup.string(),
    DurationOnStreet: yup.string(),
    PSOName: yup.string(),
    CWCRefNo: yup.string(),
    CWCStayReason: yup.string()

})

export default class GeneralInfoForm extends React.Component{
    render() {
        return (
            <View style = {globalStyles.container}>

                <Formik
                initialValues = {
                    {
                        IdentificationPlace1 : '', 
                        MarkType1: '', 
                        IdentificationPlace2 : '', 
                        MarkType2: '', 
                        SpecialNeed: '',
                        OccupationOnStreet: '',
                        DurationOnStreet: '',
                        PSOName: '',
                        CWCRefNo: '',
                        CWCStayReason: ''
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
                                <Text style = {globalStyles.errormsg}>{ props.touched.IdentificationPlace1 && props.errors.IdentificationPlace1 }</Text>
                                <Picker
                                    selectedValue={props.values.IdentificationPlace1}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('IdentificationPlace1')}
                                    value = {props.values.IdentificationPlace1}
                                    >
                                        <Picker.Item label="Select Identification" value="" />
                                        <Picker.Item label="Head" value="Head" />
                                        <Picker.Item label="ForeHead" value="ForeHead" />
                                        <Picker.Item label = "Face" value = "Face"/>
                                        <Picker.Item label = "Eye" value = "Eye"/>
                                        <Picker.Item label = "Eyebrow" value = "Eyebrow"/>
                                        <Picker.Item label = "Eyebrow" value = "Eyebrow"/>
                                </Picker>
                                
                                <Text style = {globalStyles.text}>MarkType1</Text>
                                <Text style = {globalStyles.errormsg}>{ props.touched.MarkType1 && props.errors.MarkType1 }</Text>
                                <Picker
                                    selectedValue={props.values.MarkType1}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('MarkType1')}
                                    enabled = {props.values.IdentificationPlace1 == '' ? false : true}
                                    >
                                        <Picker.Item label="Select MarkType" value="" />
                                        <Picker.Item label="Mole" value="Mole" />
                                        <Picker.Item label="Scar" value="Scar" />
                                        <Picker.Item label = "Tatoos" value = "Tatoos"/>
                                        <Picker.Item label = "BurnMarks" value = "BurnMarks"/>
                                        <Picker.Item label = "Unknown" value = "Unknown"/>
                                </Picker>
                                <Text style = {globalStyles.text}>IdentificationPlace2</Text>
                                <Picker
                                    selectedValue={props.values.IdentificationPlace2}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('IdentificationPlace2')}
                                    value = {props.values.IdentificationPlace2}
                                    >
                                        <Picker.Item label="Select Identification" value="" />
                                        <Picker.Item label="Head" value="Head" />
                                        <Picker.Item label="ForeHead" value="ForeHead" />
                                        <Picker.Item label = "Face" value = "Face"/>
                                        <Picker.Item label = "Eye" value = "Eye"/>
                                        <Picker.Item label = "Eyebrow" value = "Eyebrow"/>
                                        <Picker.Item label = "Eyebrow" value = "Eyebrow"/>
                                </Picker>
                                <Text style = {globalStyles.text}>MarkType2</Text>
                                <Picker
                                    selectedValue={props.values.MarkType2}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('MarkType2')}
                                    enabled = {props.values.IdentificationPlace2 == '' ? false : true}
                                    >
                                        <Picker.Item label="Select MarkType" value="" />
                                        <Picker.Item label="Mole" value="Mole" />
                                        <Picker.Item label="Scar" value="Scar" />
                                        <Picker.Item label = "Tatoos" value = "Tatoos"/>
                                        <Picker.Item label = "BurnMarks" value = "BurnMarks"/>
                                        <Picker.Item label = "Unknown" value = "Unknown"/>
                                </Picker>
                                <Text style = {globalStyles.text}>Special Need</Text>
                                <Picker
                                    selectedValue={props.values.SpecialNeed}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('SpecialNeed')}
                                    >
                                        <Picker.Item label="Select Differently Abled Group" value="Select Differently Abled Group" />
                                        <Picker.Item label="Hearing Impairment" value="Hearing Impairment" />
                                        <Picker.Item label = "Speech Impairment" value = "Speech Impairment"/>
                                        <Picker.Item label = "Blindness" value = "Blindness"/>
                                        <Picker.Item label = "Low Vision" value = "Low Vision"/>
                                        <Picker.Item label = "Mental Illeness" value = "Mental Illeness"/>
                                        <Picker.Item label = "Mental Retardation" value = "Mental Retardation"/>
                                        <Picker.Item label = "Locomotors Disability" value = "Locomotors Disability"/>
                                        <Picker.Item label = "Leprocy" value = "Leprocy"/>
                                        <Picker.Item label = "None" value = "None"/>
                                        <Picker.Item label = "Chornic Illeness" value = "Chornic Illeness"/>
                                </Picker>
                                <Text style = {globalStyles.text}>Occupation On Street</Text>
                                <Picker
                                    selectedValue={props.values.OccupationOnStreet}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('OccupationOnStreet')}
                                >
                                        <Picker.Item label="Select Occupation" value="" />
                                        <Picker.Item label="Rag Picking" value="Rag Picking" />
                                        <Picker.Item label="Shoe Polish" value="Shoe Polish" />
                                        <Picker.Item label = "Begging" value = "Begging"/>
                                        <Picker.Item label = "Seller" value = "Seller"/>
                                        <Picker.Item label = "Child Labour" value = "Child Labour"/>
                                </Picker>
                                <Text style = {globalStyles.text}>Duration On Street</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('DurationOnStreet')} //This will update the IdentificationMArk value in 'values'
                                    value = {props.values.DurationOnStreet} //value updated in 'values' is reflected here
                                />
                                <Text style = {globalStyles.text}>Previously Stayed Organisation Name</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    //placeholder = 'MarkType'
                                    onChangeText = {props.handleChange('PSOName')}
                                    value = {props.values.PSOName}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.text}>CWC Reference No</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    //placeholder = 'MarkType'
                                    onChangeText = {props.handleChange('CWCRefNo')}
                                    value = {props.values.CWCRefNo}
                                />
                                <Text style = {globalStyles.text}>CWC Stay Reason</Text>
                                <Picker
                                    selectedValue={props.values.CWCStayReason}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('CWCStayReason')}
                                >
                                    <Picker.Item label="Select Stay Reason" value="" />
                                    <Picker.Item label="Long term stay (care and protection including health, education etc.)" value="Long term" />
                                    <Picker.Item label="Short term stay (Repatriation, adoption and foster care)" value="Short term" />
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