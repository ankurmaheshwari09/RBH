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
import {base_url,getDataAsync} from '../constants/Base';
import { ActivityIndicator } from 'react-native';
import { getOrgId } from '../constants/LoginConstant';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const EditChildSchema = yup.object({
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
    DOA: yup.string().required(),
    ReferredSource: yup.string().required(),
    ReferredBy: yup.string().required(),
});

const editChildStyles = StyleSheet.create({
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
    },
  });

const defaultImg = require('../assets/person.png');

export default class EditChild extends React.Component{

    
    state = {
        child: this.props.childData,
        image : null,
        showdob: false,
        showdoa: false,
        orgid: '',
        sucessDisplay: false,
        errorDisplay: false,
        loading: false,
        isVisible: false,
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
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof(a));
        this.setState({dob:a, showdob: false});
        handleChange(a);
    }

    _pickDoa = (event,date,handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof(a));
        this.setState({doa:a, showdoa: false});
        handleChange(a);
    }

    showDatepickerDOB = () => {
        this.setState({showdob: true});
    };

    showDatepickerDOA = () => {
        this.setState({showdoa: true});
    };

    handleDobChange = () => {
        console.log("change called");
    }

    getDate(date){
        return moment(date).format('YYYY-MM-DD');
    }

    componentDidMount() {
        let orgId = getOrgId();
        this.setState({orgid: orgId});
    }

    _submitEditChildForm(values) {
        this.setState({ loading: true });
        let child = this.props.childData
        child.firstName = values.FirstName,
        child.lastName = values.LastName,
        child.gender = values.Gender,
        child.dateOfBirth = values.DOB,
        child.religion = values.Religion,
        child.community = values.Community,
        child.motherTongue = values.MotherTongue,
        child.parentalStatus = values.ParentalStatus,
        child.reasonForAdmission = values.ReasonForAdmission,
        child.educationStatus = values.PreviousEducationStatus,
        child.admissionDate = values.DOA,
        child.admittedBy = values.AdmittedBy,
        child.referredBy = values.ReferredBy,
        child.referredSource = values.ReferredSource,
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
            <View style = {editChildStyles.container}>
                

                <Formik
                initialValues = {
                    {
                        ChildPhoto: '',
                        ChildID: '',
                        FirstName: this.state.child.firstName ? this.state.child.firstName : '',
                        LastName: this.state.child.lastName ? this.state.child.lastName : '',
                        Gender: this.state.child.gender ? this.state.child.gender.toString() : '',
                        DOB: this.getDate(this.state.child.dateOfBirth),
                        DOA: this.getDate(this.state.child.admissionDate),
                        Religion: this.state.child.religion ? this.state.child.religion : '',
                        Community: this.state.child.community ? this.state.child.community : '',
                        MotherTongue: this.state.child.motherTongue ? this.state.child.motherTongue : '',
                        ParentalStatus: this.state.child.parentalStatus ? this.state.child.parentalStatus : '',
                        ReasonForAdmission: this.state.child.reasonForAdmission ? this.state.child.reasonForAdmission : '',
                        PreviousEducationStatus: this.state.child.educationStatus ? this.state.child.educationStatus : '',
                        AdmittedBy: this.state.child.admittedBy ? this.state.child.admittedBy : '',
                        ReferredSource: this.state.child.referredSource ? this.state.child.referredSource : '',
                        ReferredBy: this.state.child.referredBy ? this.state.child.referredBy : '',
                        //ChildStatus: this.state.child.childStatus ? this.state.child.childStatus : '',
                    }
                }
                validationSchema = {EditChildSchema}
                onSubmit = {async (values, actions) => {
                    console.log("Submit method called here ");
                    let result = this._submitEditChildForm(values);
                    //console.log(result);
                    //actions.resetForm();
                }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior="null"
                                                    enabled style={globalStyles.keyboardavoid}
                                                    keyboardVerticalOffset={0}>
                        <ScrollView>
                            
                            <View>
                                {/* Child Photo */}
                                <Text style = {editChildStyles.label}>Child Image :</Text>
                                {
                                    <Image source={{ uri: this.state.image }} style={editChildStyles.image} />
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildPhoto && props.errors.ChildPhoto}</Text>
                                <Button title="Upload Photo" onPress={() => this._pickImage(props.handleChange('ChildPhoto'))} />

                                
                                {/* Child Id */}
                                {/* <Text style = {addChildStyles.label}>Child Id :</Text>
                                <TextInput
                                    style = {addChildStyles.inputText}
                                    onChangeText = {props.handleChange('ChildID')} 
                                    value = {props.values.ChildID}
                                /> */}

                                {/* First Name */}
                                <Text style = {editChildStyles.label}>FirstName :</Text>
                                <TextInput
                                    style = {editChildStyles.inputText}
                                    onChangeText = {props.handleChange('FirstName')}
                                    value = {props.values.FirstName}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.FirstName && props.errors.FirstName}</Text>

                                {/* Last Name */}
                                <Text style = {editChildStyles.label}>LastName :</Text>
                                <TextInput
                                    style = {editChildStyles.inputText}
                                    onChangeText = {props.handleChange('LastName')}
                                    value = {props.values.LastName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.LastName && props.errors.LastName}</Text>

                                {/* Gender */}
                                <Text style = {editChildStyles.label}>Gender :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Gender && props.errors.Gender}</Text>
                                <Picker
                                    selectedValue = {props.values.Gender}
                                    onValueChange = {props.handleChange('Gender')}
                                    style = {editChildStyles.dropDown}
                                >
                                    <Picker.Item label='Select Gender' value = ''/>
                                    <Picker.Item label='Male' value = '1'/>
                                    <Picker.Item label='Female' value = '2'/>
                                </Picker>

                                {/* DOB */}
                                <Text style = {editChildStyles.label}>Date Of Birth :</Text>
                                <View style={editChildStyles.dobView}>
                                    <TextInput
                                        style = {editChildStyles.inputText, editChildStyles.dobValue}
                                        value = {props.values.DOB}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOB')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOB}>
                                        <View>
                                            <Feather style={editChildStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {addChildStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showdob && 
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
                                <Text style = {editChildStyles.label}>Religion :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Religion && props.errors.Religion}</Text>
                                <Picker
                                    selectedValue = {props.values.Religion}
                                    onValueChange = {value => {
                                        props.setFieldValue('Religion', value);
                                    }}
                                    style = {editChildStyles.dropDown}
                                >
                                    <Picker.Item label='Select Religion' value = ''/>
                                    { 
                                        global.religions.map((item) => {
                                            return <Picker.Item key = {item.religionId} label = {item.religion} value = {item.religionId}/>
                                        })
                                    }
                                </Picker>

                                {/* Community */}
                                <Text style = {editChildStyles.label}>Community :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Community && props.errors.Community}</Text>
                                <Picker
                                    selectedValue = {props.values.Community}
                                    onValueChange = {value => {
                                        props.setFieldValue('Community', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Community' value = ''/>
                                    {
                                        global.communities.map((item) => {
                                            return <Picker.Item key = {item.communityId} label = {item.community} value = {item.communityId}/>
                                        })
                                    }
                                </Picker>

                                {/* Mother Tongue */}
                                <Text style = {editChildStyles.label}>Mother Tongue :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.MotherTongue && props.errors.MotherTongue}</Text>
                                <Picker
                                    selectedValue = {props.values.MotherTongue}
                                    onValueChange = {value => {
                                        props.setFieldValue('MotherTongue', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Mother Tongue' value = ''/>
                                    {
                                        global.motherTongues.map((item) => {
                                            return <Picker.Item key = {item.motherTongueId} label = {item.motherTongue} value = {item.motherTongueId}/>
                                        })
                                    }
                                </Picker>

                                {/* Parental Status */}
                                <Text style = {editChildStyles.label}>Parental Status :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ParentalStatus && props.errors.ParentalStatus}</Text>
                                <Picker
                                    selectedValue = {props.values.ParentalStatus}
                                    onValueChange = {value => {
                                        props.setFieldValue('ParentalStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Parental Status' value = ''/>
                                    {
                                        global.parentalStatusList.map((item) => {
                                            return <Picker.Item key = {item.parentalStatusId} label = {item.parentalStatus} value = {item.parentalStatusId}/>
                                        })
                                    }
                                </Picker>

                                {/* Reason For Admission */}
                                <Text style = {editChildStyles.label}>Reason For Admission :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReasonForAdmission && props.errors.ReasonForAdmission}</Text>
                                <Picker
                                    selectedValue = {props.values.ReasonForAdmission}
                                    onValueChange = {value => {
                                        props.setFieldValue('ReasonForAdmission', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Reason For Admission' value = ''/>
                                    {
                                        global.admissionReasons.map((item) => {
                                            return <Picker.Item key = {item.reasonForAdmissionId} label = {item.reasonForAdmission} value = {item.reasonForAdmissionId}/>
                                        })
                                    }
                                </Picker>

                                {/* Previous Education Status */}
                                <Text style = {editChildStyles.label}>Previous Education Status :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.PreviousEducationStatus && props.errors.PreviousEducationStatus}</Text>
                                <Picker
                                    selectedValue = {props.values.PreviousEducationStatus}
                                    onValueChange = {value => {
                                        props.setFieldValue('PreviousEducationStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Previous Education Status' value = ''/>
                                    {
                                        global.educationStatusList.map((item) => {
                                            return <Picker.Item key = {item.educationStatusId} label = {item.educationStatus} value = {item.educationStatusId}/>
                                        })
                                    }
                                </Picker>

                                {/* Admitted By */}
                                <Text style = {editChildStyles.label}>Admitted By :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.AdmittedBy && props.errors.AdmittedBy}</Text>
                                <Picker
                                    selectedValue = {props.values.AdmittedBy}
                                    onValueChange = {value => {
                                        props.setFieldValue('AdmittedBy', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Admitted By' value = ''/>
                                    {
                                        global.homeStaffList.map((item) => {
                                            return <Picker.Item key = {item.staffNo} label = {item.firstName + ' ' + item.lastName} value = {item.staffNo}/>
                                        })
                                    }
                                </Picker>

                                {/* DOA */}
                                <Text style = {editChildStyles.label}>Date Of Admission :</Text>
                                <View style={editChildStyles.dobView}>
                                    <TextInput
                                        style = {editChildStyles.inputText, editChildStyles.dobValue}
                                        value = {props.values.DOA}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOA')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOA}>
                                        <View>
                                            <Feather style={editChildStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {addChildStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showdoa && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            mode="date" //The enum of date, datetime and time
                                            value={ new Date() }
                                            mode= { 'date' }
                                            onChange= {(e,date) => this._pickDoa(e,date,props.handleChange('DOA'))} 
                                        />
                                    }
                                    <Text style = {globalStyles.errormsg}>{props.touched.DOB && props.errors.DOB}</Text>
                                </View>

                                {/* Referred Source */}
                                <Text style = {editChildStyles.label}>Referred Source :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredSource && props.errors.ReferredSource}</Text>
                                <Picker
                                    selectedValue = {props.values.ReferredSource}
                                    onValueChange = {value => {
                                        props.setFieldValue('ReferredSource', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Referred Source' value = ''/>
                                    {
                                        global.referralSourcesList.map((item) => {
                                            return <Picker.Item key = {item.referralSourceId} label = {item.referralSource} value = {item.referralSourceId}/>
                                        })
                                    }
                                </Picker>

                                {/* Referred By */}
                                <Text style = {editChildStyles.label}>Referred By :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredBy && props.errors.ReferredBy}</Text>
                                <TextInput
                                    style = {editChildStyles.inputText}
                                    onChangeText = {props.handleChange('ReferredBy')}
                                    value = {props.values.ReferredBy}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />

                                <Button style = {editChildStyles.button} title="Submit" onPress={props.handleSubmit} />
                            </View>
                        </ScrollView>  
                        </KeyboardAvoidingView>
                                                  
                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Child Info' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}