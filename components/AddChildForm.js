import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert} from 'react-native';
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
    DOA: yup.string().required(),
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
    },
  });

const defaultImg = require('../assets/person.png');

export default class AddChild extends React.Component{

    
    state = {
        image : null,
        showdob: false,
        showdoa: false,
        showLoader: false,
        loaderIndex: 0,
        dob: '',
        doa: '',
        religions: [],
        communities: [],
        motherTongues: [],
        parentalStatusList: [],
        admissionReasons: [],
        educationStatusList: [],
        homeStaffList: [],
        referralSourcesList: [],
        childStatusList: [],
        submitAlertMessage: '',
        photoUploadMessage: '',
        orgid: '',
        isVisible: false,
        sucessDisplay: false,
        errorDisplay: false,
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

    async addChildConstants(){
        getDataAsync(base_url + '/religions').then(data => {console.log(data); this.setState({religions: data})});
    
        getDataAsync(base_url + '/communities').then(data => {console.log(data);this.setState({communities: data})});
    
        getDataAsync(base_url + '/mother-tongues').then(data => {console.log(data);this.setState({motherTongues: data})});
    
        getDataAsync(base_url + '/parental-statuses').then(data => {console.log(data);this.setState({parentalStatusList: data})});
    
        getDataAsync(base_url + '/admission-reasons').then(data => {console.log(data);this.setState({admissionReasons: data})});
    
        getDataAsync(base_url + '/education-statuses').then(data => {console.log(data);this.setState({educationStatusList: data})});
    
        getDataAsync(base_url + '/home-staff-list').then(data => {console.log(data);this.setState({homeStaffList: data})});
        
        getDataAsync(base_url + '/referral-sources').then(data => {console.log(data);this.setState({referralSourcesList: data})});
    
        getDataAsync(base_url + '/child-statuses').then(data => {console.log(data);this.setState({childStatusList: data})});
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

    componentDidMount() {
        this.addChildConstants();
        let orgId = getOrgId();
        this.setState({orgid: orgId});
    }

    _submitAddChildForm(values) {
        console.log("submitchild called");
        let request_body = JSON.stringify({
            "firstName": values.FirstName,
            "lastName": values.LastName,
            "gender": values.Gender,
            "dateOfBirth": values.DOB,
            "religion": values.Religion,
            "community": values.Community,
            "motherTongue": values.MotherTongue,
            "parentalStatus": values.ParentalStatus,
            "reasonForAdmission": values.ReasonForAdmission,
            "educationStatus": values.PreviousEducationStatus,
            "admissionDate":values.DOA,
            "admittedBy": values.AdmittedBy,
            "referredBy": values.ReferredBy,
            "referredSource": values.ReferredSource,
            "childStatus": values.ChildStatus,
            "rainbowHomeNumber": this.state.orgid
        });
        // console.log(request_body);
        let result = {};
        fetch(base_url+"/child", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            let photoUrl = base_url+"/upload-image/"+responseJson.childNo;
            console.log(photoUrl);
            let imageUri = ''
            if(this.state.image == null) {
                imageUri= ''
            }
            else {
                imageUri = this.state.image;
            }
            console.log(imageUri);
            fetch(photoUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: {
                    "file": imageUri,
                }
            })
            .then((response) => {
                console.log(response.status)
                console.log("succesfully uploaded image");
                // console.log(response);
                this.state.photoUploadMessage = "Succesfully uploaded image";
                this.setState({submitAlertMessage: 'Successfully added child with Child Number '+responseJson.childNo+ ' '+ this.state.photoUploadMessage});
            // alert(this.state.submitAlertMessage);
                Alert.alert(
                    'Added Child',
                    this.state.submitAlertMessage,
                    [
                        { text: 'OK', onPress: () => this.props.navigation.goBack() },
                    ],
                    { cancelable: false },
                );
                // this.setState({isVisible: true});
                // this.setState({ successDisplay: true });
                this.setState({showLoader: false,loaderIndex:0});
            }) 
            .catch((error) => {
                console.log("upload image failed");
                // console.log(error);
                this.state.photoUploadMessage = "Image not uploaded succesfully";
                this.setState({submitAlertMessage: 'Successfully added child with Child Number '+responseJson.childNo+ ' '+ this.state.photoUploadMessage});
                // alert(this.state.submitAlertMessage);
                Alert.alert(
                    'Added Child',
                    this.state.submitAlertMessage,
                    [
                        { text: 'OK', onPress: () => this.props.navigation.goBack() },
                    ],
                    { cancelable: false },
                );
                // this.setState({isVisible: true});
                // this.setState({ successDisplay: true });
                this.setState({showLoader: false,loaderIndex:0});
            })
            // this.setState({submitAlertMessage: 'Successfully added child with Child Number '+responseJson.childNo+ ' '+ this.state.photoUploadMessage});
            // // alert(this.state.submitAlertMessage);
            // Alert.alert(
            //     'Added Child',
            //     this.state.submitAlertMessage,
            //     [
            //         { text: 'OK', onPress: () => this.props.navigation.goBack() },
            //     ],
            //     { cancelable: false },
            // );
            // // this.setState({isVisible: true});
            // // this.setState({ successDisplay: true });
            // this.setState({showLoader: false,loaderIndex:0});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add child. Plesae contact the Admin.'});
            // alert(this.state.submitAlertMessage);
            Alert.alert(
                'Failed To Add Child',
                this.state.submitAlertMessage,
                [
                    { text: 'OK', onPress: () => console.log("Failed to add child") },
                ],
                { cancelable: false },
            );
            // this.setState({isVisible: true});
            // this.setState({ errorDisplay: true });
            console.log(error);
            this.setState({showLoader: false,loaderIndex:0});
        });
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
                        DOA: this.state.doa,
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
                onSubmit = {async (values, actions) => {
                    console.log("Submit method called here ");
                    this.setState({showLoader: true,loaderIndex:10});
                    let result = this._submitAddChildForm(values);
                    let alertMessage = this.state.submitAlertMessage;
                    console.log(result);
                    actions.resetForm();
                }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior="null"
                                                    enabled style={globalStyles.keyboardavoid}
                                                    keyboardVerticalOffset={0}>
                        <View style={{ position: 'absolute', top:"45%",right: 0, left: 0, zIndex: this.state.loaderIndex }}>
                            <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                        </View>
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
                                {/* <Text style = {addChildStyles.label}>Child Id :</Text>
                                <TextInput
                                    style = {addChildStyles.inputText}
                                    onChangeText = {props.handleChange('ChildID')} 
                                    value = {props.values.ChildID}
                                /> */}

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
                                    <Picker.Item label='Male' value = '1'/>
                                    <Picker.Item label='Female' value = '2'/>
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
                                    <TouchableHighlight onPress={this.showDatepickerDOB}>
                                        <View>
                                            <Feather style={addChildStyles.dobBtn}  name="calendar"/>
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
                                <Text style = {addChildStyles.label}>Religion :</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Religion && props.errors.Religion}</Text>
                                <Picker
                                    selectedValue = {props.values.Religion}
                                    onValueChange = {value => {
                                        props.setFieldValue('Religion', value);
                                    }}
                                    style = {addChildStyles.dropDown}
                                >
                                    <Picker.Item label='Select Religion' value = ''/>
                                    { 
                                        this.state.religions.map((item) => {
                                            return <Picker.Item key = {item.religionId} label = {item.religion} value = {item.religionId}/>
                                        })
                                    }
                                </Picker>

                                {/* Community */}
                                <Text style = {addChildStyles.label}>Community :</Text>
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
                                        this.state.communities.map((item) => {
                                            return <Picker.Item key = {item.communityId} label = {item.community} value = {item.communityId}/>
                                        })
                                    }
                                </Picker>

                                {/* Mother Tongue */}
                                <Text style = {addChildStyles.label}>Mother Tongue :</Text>
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
                                        this.state.motherTongues.map((item) => {
                                            return <Picker.Item key = {item.motherTongueId} label = {item.motherTongue} value = {item.motherTongueId}/>
                                        })
                                    }
                                </Picker>

                                {/* Parental Status */}
                                <Text style = {addChildStyles.label}>Parental Status :</Text>
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
                                        this.state.parentalStatusList.map((item) => {
                                            return <Picker.Item key = {item.parentalStatusId} label = {item.parentalStatus} value = {item.parentalStatusId}/>
                                        })
                                    }
                                </Picker>

                                {/* Reason For Admission */}
                                <Text style = {addChildStyles.label}>Reason For Admission :</Text>
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
                                        this.state.admissionReasons.map((item) => {
                                            return <Picker.Item key = {item.reasonForAdmissionId} label = {item.reasonForAdmission} value = {item.reasonForAdmissionId}/>
                                        })
                                    }
                                </Picker>

                                {/* Previous Education Status */}
                                <Text style = {addChildStyles.label}>Previous Education Status :</Text>
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
                                        this.state.educationStatusList.map((item) => {
                                            return <Picker.Item key = {item.educationStatusId} label = {item.educationStatus} value = {item.educationStatusId}/>
                                        })
                                    }
                                </Picker>

                                {/* Admitted By */}
                                <Text style = {addChildStyles.label}>Admitted By :</Text>
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
                                        this.state.homeStaffList.map((item) => {
                                            return <Picker.Item key = {item.staffNo} label = {item.firstName + ' ' + item.lastName} value = {item.staffNo}/>
                                        })
                                    }
                                </Picker>

                                {/* DOA */}
                                <Text style = {addChildStyles.label}>Date Of Admission :</Text>
                                <View style={addChildStyles.dobView}>
                                    <TextInput
                                        style = {addChildStyles.inputText, addChildStyles.dobValue}
                                        value = {this.state.doa}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOA')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOA}>
                                        <View>
                                            <Feather style={addChildStyles.dobBtn}  name="calendar"/>
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
                                <Text style = {addChildStyles.label}>Referred Source :</Text>
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
                                        this.state.referralSourcesList.map((item) => {
                                            return <Picker.Item key = {item.referralSourceId} label = {item.referralSource} value = {item.referralSourceId}/>
                                        })
                                    }
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
                                    onValueChange = {value => {
                                        props.setFieldValue('ChildStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Child Status' value = ''/>
                                    {
                                        this.state.childStatusList.map((item) => {
                                            return <Picker.Item key = {item.childStatusId} label = {item.childStatus} value = {item.childStatusId}/>
                                        })
                                    }
                                </Picker>

                                <Button style = {addChildStyles.button} title="Submit" onPress={props.handleSubmit} />
                            </View>
                        </ScrollView>  
                        </KeyboardAvoidingView>
                                                  
                    )}

                </Formik>
                {/* <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='General Info' />
                    </View>
                </Modal> */}
            </View>
        );
    }
}