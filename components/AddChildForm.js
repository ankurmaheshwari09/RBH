import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Feather} from '@expo/vector-icons';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as ImagePicker from 'expo-image-picker';
import * as yup from 'yup';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';

const AddChildSchema = yup.object({
    // ChildPhoto: yup.object(),
    ChildID: yup.string(),
    FirstName: yup.string().required(),
    LastName: yup.string().required(),
    Gender: yup.string().required(),
    DOB: yup.string().required(),
    Religion: yup.string().required(),
    Community: yup.string().required(),
    MotherTongue: yup.string().required(),
    ParentalStatus: yup.string().required(),
    ReasonForAdmission: yup.string().required(),
    PreviousEducationStatus: yup.string().required(),
    AdmittedBy: yup.string().required(),
    ReferredSource: yup.string().required(),
    ReferredBy: yup.string().required(),
    ChildStatus: yup.string().required(),
});

const addChildStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
    },
    label: {
        fontSize: 14,
        paddingTop: 5,
        fontWeight: 'bold',
    },
    button: {
        color: 'blue',
        padding: 10,
        borderRadius: 6,
        marginBottom: 5,
        fontSize: 18,
        position: 'relative',
        paddingTop: 10
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6
    },
    dropDown: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6
    },
    image: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '25%',
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "black"
    },
    dobView: {
        flex: 1,
        flexDirection: 'row',
    },
    dobValue: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
    },
    dobBtn: {
        marginLeft: 2,
        flex: 2,
        fontSize: 40,
    }
  });

const defaultImg = require('../assets/person.png');

export default class AddChild extends React.Component{

    
    state = {
        image : null,
        show: false,
        dob: '',
    };

    async _pickImage (handleChange) {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [3, 3],
        });
        console.log(result);
        if (!result.cancelled) {
            this.setState({ image: result.uri });
            handleChange(result.uri)
        }
    }

    _pickDob = (event,date,handleChange) => {
        console.log(date);
        let a = moment(date).format('DD/MM/YYYY');
        console.log(a);
        console.log(typeof(a));
        this.setState({dob:a, show: false});
        handleChange(a);
    }

    showDatepicker = () => {
        this.setState({show: true});
    };

    handleDobChange = () => {
        console.log("change called");
    }

    

    render() {
        
        return (
            <View style = {addChildStyles.container}>
                

                <Formik
                initialValues = {
                    {
                        ChildPhoto: '',
                        ChildID: '',
                        FirstName: '',
                        LastName: '',
                        Gender: '',
                        DOB: this.state.dob,
                        Religion: '',
                        Community: '',
                        MotherTongue: '',
                        ParentalStatus: '',
                        ReasonForAdmission:'',
                        PreviousEducationStatus: '',
                        AdmittedBy: '',
                        ReferredSource: '',
                        ReferredBy: '',
                        ChildStatus: '',
                    }
                }
                validationSchema = {AddChildSchema}
                onSubmit = {(values, actions) => {
                    console.log("Submit method called");
                    actions.resetForm();
                    console.log(values);
                    alert("Data Has been submitted")
                    this.props.navigation.navigate('Info', values)
                    
                }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior="padding" 
                            enabled style={globalStyles.keyboardavoid} 
                            keyboardVerticalOffset={150}>
                        <ScrollView>

                            
                            <View>
                                {/* Child Photo */}
                                <Text style = {addChildStyles.label}>Child Image :</Text>
                                {
                                    <Image source={{ uri: this.state.image }} style={addChildStyles.image} />
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildPhoto && props.errors.ChildPhoto}</Text>
                                <Button title="Upload Photo" onPress={() => this._pickImage(props.handleChange('ChildPhoto'))} />

                                
                                {/* Child Id */}
                                <Text style = {addChildStyles.label}>Child Id :</Text>
                                <TextInput
                                    style = {addChildStyles.inputText}
                                    onChangeText = {props.handleChange('ChildID')} 
                                    value = {props.values.ChildID}
                                />

                                {/* First Name */}
                                <Text style = {addChildStyles.label}>FirstName :</Text>
                                <TextInput
                                    style = {addChildStyles.inputText}
                                    onChangeText = {props.handleChange('FirstName')}
                                    value = {props.values.FirstName}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.FirstName && props.errors.FirstName}</Text>

                                {/* Last Name */}
                                <Text style = {addChildStyles.label}>LastName :</Text>
                                <TextInput
                                    style = {addChildStyles.inputText}
                                    onChangeText = {props.handleChange('LastName')}
                                    value = {props.values.LastName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.LastName && props.errors.LastName}</Text>

                                {/* Gender */}
                                <Text style = {addChildStyles.label}>Gender :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Gender && props.errors.Gender}</Text>
                                <Picker
                                    selectedValue = {props.values.Gender}
                                    onValueChange = {props.handleChange('Gender')}
                                    style = {addChildStyles.dropDown}
                                >
                                    <Picker.Item label='Select Gender' value = ''/>
                                    <Picker.Item label='Male' value = 'Male'/>
                                    <Picker.Item label='Female' value = 'Female'/>
                                </Picker>

                                {/* DOB */}
                                <Text style = {addChildStyles.label}>Date Of Birth :</Text>
                                <View style={addChildStyles.dobView}>
                                    <TextInput
                                        style = {addChildStyles.inputText, addChildStyles.dobValue}
                                        value = {this.state.dob}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOB')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepicker}>
                                        <View>
                                            <Feather style={addChildStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {addChildStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.show && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            mode="date" //The enum of date, datetime and time
                                            value={ new Date() }
                                            mode= { 'date' }
                                            onChange= {(e,date) => this._pickDob(e,date,props.handleChange('DOB'))} 
                                        />
                                    }
                                    <Text style = {globalStyles.errormsg}>{props.touched.DOB && props.errors.DOB}</Text>
                                </View>
                                

                                {/* Religion */}
                                <Text style = {addChildStyles.label}>Religion :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Religion && props.errors.Religion}</Text>
                                <Picker
                                    selectedValue = {props.values.Religion}
                                    onValueChange = {props.handleChange('Religion')}
                                    style = {addChildStyles.dropDown}
                                >
                                    <Picker.Item label='Select Religion' value = ''/>
                                    <Picker.Item label='Hindu' value = 'Hindu'/>
                                    <Picker.Item label='Muslim' value = 'Muslim'/>
                                    <Picker.Item label='Christian' value = 'Christian'/>
                                </Picker>

                                {/* Community */}
                                <Text style = {addChildStyles.label}>Community :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Community && props.errors.Community}</Text>
                                <Picker
                                    selectedValue = {props.values.Community}
                                    onValueChange = {props.handleChange('Community')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Community' value = ''/>
                                    <Picker.Item label='SC' value = 'SC'/>
                                    <Picker.Item label='ST' value = 'ST'/>
                                    <Picker.Item label='MBC' value = 'MBC'/>
                                    <Picker.Item label='BC' value = 'BC'/>
                                    <Picker.Item label='OBC' value = 'OBC'/>
                                    <Picker.Item label='OC' value = 'OC'/>
                                    <Picker.Item label='Minority' value = 'Minority'/>
                                    <Picker.Item label='General' value = 'General'/>
                                    <Picker.Item label='NT' value = 'NT'/>
                                </Picker>

                                {/* Mother Tongue */}
                                <Text style = {addChildStyles.label}>Mother Tongue :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.MotherTongue && props.errors.MotherTongue}</Text>
                                <Picker
                                    selectedValue = {props.values.MotherTongue}
                                    onValueChange = {props.handleChange('MotherTongue')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Mother Tongue' value = ''/>
                                    <Picker.Item label='English' value = 'English'/>
                                    <Picker.Item label='Hindi' value = 'Hindi'/>
                                    <Picker.Item label='Telugu' value = 'Telugu'/>
                                    <Picker.Item label='Tamil' value = 'Tamil'/>
                                </Picker>

                                {/* Parental Status */}
                                <Text style = {addChildStyles.label}>Parental Status :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ParentalStatus && props.errors.ParentalStatus}</Text>
                                <Picker
                                    selectedValue = {props.values.ParentalStatus}
                                    onValueChange = {props.handleChange('ParentalStatus')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Parental Status' value = ''/>
                                    <Picker.Item label='Both Parents Alive' value = '0'/>
                                    <Picker.Item label='Only Father Alive' value = '1'/>
                                    <Picker.Item label='Only Mother Alive' value = '2'/>
                                </Picker>

                                {/* Reason For Admission */}
                                <Text style = {addChildStyles.label}>Reason For Admission :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReasonForAdmission && props.errors.ReasonForAdmission}</Text>
                                <Picker
                                    selectedValue = {props.values.ReasonForAdmission}
                                    onValueChange = {props.handleChange('ReasonForAdmission')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Reason For Admission' value = ''/>
                                    <Picker.Item label='Child Marriage' value = '0'/>
                                    <Picker.Item label='Home Less' value = '1'/>
                                    <Picker.Item label='Parents In Prison' value = '2'/>
                                </Picker>

                                {/* Previous Education Status */}
                                <Text style = {addChildStyles.label}>Previous Education Status :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.PreviousEducationStatus && props.errors.PreviousEducationStatus}</Text>
                                <Picker
                                    selectedValue = {props.values.PreviousEducationStatus}
                                    onValueChange = {props.handleChange('PreviousEducationStatus')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Previous Education Status' value = ''/>
                                    <Picker.Item label='Never Enrolled' value = '0'/>
                                    <Picker.Item label='Drop Out' value = '1'/>
                                    <Picker.Item label='Irregular Schooling' value = '2'/>
                                </Picker>

                                {/* Admitted By */}
                                <Text style = {addChildStyles.label}>Admitted By :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.AdmittedBy && props.errors.AdmittedBy}</Text>
                                <Picker
                                    selectedValue = {props.values.AdmittedBy}
                                    onValueChange = {props.handleChange('AdmittedBy')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Admitted By' value = ''/>
                                    <Picker.Item label='Babu' value = '0'/>
                                    <Picker.Item label='Raju' value = '1'/>
                                </Picker>

                                {/* Referred Source */}
                                <Text style = {addChildStyles.label}>Referred Source :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredSource && props.errors.ReferredSource}</Text>
                                <Picker
                                    selectedValue = {props.values.ReferredSource}
                                    onValueChange = {props.handleChange('ReferredSource')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Referred Source' value = ''/>
                                    <Picker.Item label='Police' value = '0'/>
                                    <Picker.Item label='Again Police' value = '1'/>
                                </Picker>

                                {/* Referred By */}
                                <Text style = {addChildStyles.label}>Referred By :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredBy && props.errors.ReferredBy}</Text>
                                <TextInput
                                    style = {addChildStyles.inputText}
                                    onChangeText = {props.handleChange('ReferredBy')}
                                    value = {props.values.ReferredBy}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />

                                {/* Child Status */}
                                <Text style = {addChildStyles.label}>Child Status :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildStatus && props.errors.ChildStatus}</Text>
                                <Picker
                                    selectedValue = {props.values.ChildStatus}
                                    onValueChange = {props.handleChange('ChildStatus')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Child Status' value = ''/>
                                    <Picker.Item label='Observation' value = '0'/>
                                    <Picker.Item label='Present' value = '1'/>
                                </Picker>

                                <Button style = {addChildStyles.button} title="Submit" onPress={props.handleSubmit} />
                            </View>
                        </ScrollView>  
                        </KeyboardAvoidingView>
                                                  
                    )}

                </Formik>

            </View>
        );
    }
}