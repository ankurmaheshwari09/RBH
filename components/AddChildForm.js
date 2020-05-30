import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
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
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import {guidGenerator} from '../constants/Base';

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


const defaultImg = require('../assets/person.png');

export default class AddChild extends React.Component{

    
    state = {
        image : null,
        showdob: false,
        showdoa: false,
        showLoader: false,
        loaderIndex: 0,
        gender: 2,
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
        pageOne: true,
        pageTwo: false,
        pageThree: false,
        currentPage: 1,
    };

    async _pickImage (handleChange) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if(status == 'granted'){
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });
            console.log(result);
            if (!result.cancelled) {
                this.setState({ image: result.uri });
                handleChange(result.uri)
            }
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

    _changeGender = (value, handleChange) => {
        console.log('gender change');
        console.log(value);
        this.setState({gender: value});
        handleChange(value);
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

    modalclickOKSuccess = () => {
        this.props.navigation.goBack();
    }

    modalclickOKError = () => {
        this.setState({isVisible: false});
    }

    componentDidMount() {
        this.addChildConstants();
        let orgId = getOrgId();
        this.setState({orgid: orgId});
    }

    changeprevstyle() {
        if(this.state.currentPage == 1) {
            return globalStyles.prevnextbuttonsgrey;
        }
        else {
            return globalStyles.prevnextbuttons;
        }
    }

    resetForm() {
        this.setState({currentPage: 1});
        this.setState({pageOne: true,pageTwo: false, pageThree: false});
        this.setState({dob:'',doa:''});
        this.setState({image : null});
    }

    changenextstyle() {
        if(this.state.currentPage == 3) {
            return globalStyles.prevnextbuttonsgrey;
        }
        else {
            return globalStyles.prevnextbuttons;
        }
    }

    changePage(type) {
        let page = this.state.currentPage;
        if(type == 'next') {
            if(this.state.currentPage <=3){
                if(this.state.currentPage == 1) {
                    this.setState({currentPage: page + 1});
                    this.setState({pageOne: false, pageTwo: true, pageThree: false});
                }
                if(this.state.currentPage == 2) {
                    this.setState({currentPage: page + 1});
                    this.setState({pageOne: false, pageTwo: false, pageThree: true});
                }
                if(this.state.currentPage == 3) {
                    this.setState({pageOne: false, pageTwo: false, pageThree: true});
                }
            }
        }
        if(type == 'prev') {
            if(this.state.currentPage >=1){
                if(this.state.currentPage == 1) {
                    this.setState({pageOne: true, pageTwo: false, pageThree: false});
                }
                if(this.state.currentPage == 2) {
                    this.setState({currentPage: page - 1});
                    this.setState({pageOne: true, pageTwo: false, pageThree: false});
                }
                if(this.state.currentPage == 3) {
                    this.setState({currentPage: page - 1});
                    this.setState({pageOne: false, pageTwo: true, pageThree: false});
                }
            }
        }
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
        var imageupload = false;
        fetch(base_url+"/child", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        // .then((response) => {
        //     if(response.status == 200) {
        //         console.log(response.status);
        //         let responseJson = response.json();
        //         console.log("printing response json");
        //         console.log(responseJson);
        //         let childId = responseJson.childNo;
        //         console.log("printing childId")
        //         console.log(childId);
        //         console.log(responseJson);
        //         let photoUrl = base_url+"/upload-image/"+responseJson.childNo;
        //         console.log(photoUrl);
        //         let imageUri = '';
        //         if(this.state.image == null) {
        //             imageUri= ''
        //         }
        //         else {
        //             imageUri = this.state.image;
        //         }
        //         console.log(imageUri);
        //         fetch(photoUrl, {
        //             method: 'PUT',
        //             headers: {},
        //             body: {
        //                 "file": imageUri,
        //             }
        //         })
        //         .then((response) => {
        //             console.log("*****");
        //             console.log(response.status);
        //             console.log("******");
        //             if(response.status == 200) {
        //                 this.state.photoUploadMessage = "Succesfully uploaded image";
        //                 imageupload = true;
        //             }
        //             else {
        //                 this.state.photoUploadMessage = "Error uploading image";
        //             }
        //             this.setState({submitAlertMessage: 'Successfully added child with Child Number '+responseJson.childNo+ ' '+ this.state.photoUploadMessage});
        //             Alert.alert(
        //                 'Added Child',
        //                 this.state.submitAlertMessage,
        //                 [
        //                     { text: 'OK', onPress: () => this.props.navigation.goBack() },
        //                 ],
        //                 { cancelable: false },
        //             ); 
        //             this.setState({isVisible: true, errorDisplay: true});
        //             this.setState({showLoader: false,loaderIndex:0});
        //         })
        //         .catch((error)=> {
        //             this.state.photoUploadMessage = "Error uploading image";
        //             this.setState({submitAlertMessage: 'Successfully added child with Child Number '+responseJson.childNo+ ' '+ this.state.photoUploadMessage});
        //             Alert.alert(
        //                 'Added Child',
        //                 this.state.submitAlertMessage,
        //                 [
        //                     { text: 'OK', onPress: () => this.props.navigation.goBack() },
        //                 ],
        //                 { cancelable: false },
        //             );
        //             this.setState({isVisible: true, errorDisplay: true});
        //             this.setState({showLoader: false,loaderIndex:0});
        //         })
        //     }
        //     else {
        //         this.setState({submitAlertMessage: 'Unable to add child. Plesae contact the Admin.'});
        //         Alert.alert(
        //             'Failed To Add Child',
        //             this.state.submitAlertMessage,
        //             [
        //                 { text: 'OK', onPress: () => console.log("Failed to add child") },
        //             ],
        //             { cancelable: false },
        //         );
        //         this.setState({isVisible: true, errorDisplay: true});
        //         this.setState({showLoader: false,loaderIndex:0});
        //     }
        // })
        // .catch((error) => {
        //     this.setState({submitAlertMessage: 'Unable to add child. Plesae contact the Admin.'});
        //     alert(this.state.submitAlertMessage);
        //     Alert.alert(
        //         'Failed To Add Child',
        //         this.state.submitAlertMessage,
        //         [
        //             { text: 'OK', onPress: () => console.log("Failed to add child") },
        //         ],
        //         { cancelable: false },
        //     );
        //     this.setState({isVisible: true});
        //     this.setState({ errorDisplay: true });
        //     console.log(error);
        //     this.setState({isVisible: true, errorDisplay: true});
        //     this.setState({showLoader: false,loaderIndex:0});
        // });
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            let photoUrl = base_url+"/upload-image/"+responseJson.childNo;
            console.log(photoUrl);
            let imageUri = '';
            if(this.state.image == null) {
                imageUri= ''
            }
            else {
                imageUri = this.state.image;
            }
            var formdata = new FormData();
            formdata.append('file', { uri: imageUri, name: `${guidGenerator()}.jpg`, type: 'image/jpg' });
            console.log(imageUri);
            fetch(photoUrl, {
                method: 'PUT',
                headers: {
                    'content-type': 'multipart/form-data;boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu',
                },
                body: formdata,
            })
            .then((response) => {       
                console.log("*****");
                console.log(response.status);
                console.log(response.text());
                console.log("******");
                if(response.status == 200) {
                    this.state.photoUploadMessage = "Succesfully uploaded image";
                    imageupload = true;
                }
                else {
                    this.state.photoUploadMessage = "Error uploading image";
                }
                this.setState({submitAlertMessage: 'Successfully added child with Child Number '+responseJson.childNo+ '. '+ this.state.photoUploadMessage});
                this.resetForm();
                Alert.alert(
                    'Added Child',
                    this.state.submitAlertMessage,
                    [
                        { text: 'OK', onPress: () => this.props.navigation.goBack() },
                    ],
                    { cancelable: false },
                );
                this.setState({isVisible: true});
                if(imageupload) {
                    this.setState({ successDisplay: true });
                }
                else {
                    this.setState({ errorDisplay: true});
                }
                
                this.setState({showLoader: false,loaderIndex:0});
            }) 
            .catch((error) => {
                console.log("upload image failed");
                // console.log(error);
                this.state.photoUploadMessage = "Image not uploaded succesfully";
                this.setState({submitAlertMessage: 'Successfully added child with Child Number '+responseJson.childNo+ ' '+ this.state.photoUploadMessage});
                // alert(this.state.submitAlertMessage);
                this.resetForm();
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
            this.resetForm();
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

        const radio_props = [
            {
                label: 'Male',
                value: '1',
            },
            {
                label: 'Female',
                value: '2',
            }
        ];
        
        return (
            <View style = {globalStyles.container}>
                

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
                        <ScrollView showsVerticalScrollIndicator={false}>
                            
                            <View style= {globalStyles.topView}>
                                {this.state.pageOne && <View>
                                    <View style={globalStyles.backgroundlogoimageview}>
                                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>
                                {/* Child Photo */}
                                
                                <Text style = {globalStyles.label}>Child Image:</Text>
                                {
                                    <Image source={{ uri: this.state.image }} style={globalStyles.uploadImage}/>
                                }
                                <Button title="Upload Photo" onPress={() => this._pickImage(props.handleChange('ChildPhoto'))} />
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildPhoto && props.errors.ChildPhoto}</Text>
                                
                                {/* Child Id */}
                                {/* <Text style = {globalStyles.label}>Child Id :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('ChildID')} 
                                    value = {props.values.ChildID}
                                /> */}

                                {/* First Name */}
                                <Text style = {globalStyles.label}>First Name :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('FirstName')}
                                    value = {props.values.FirstName}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.FirstName && props.errors.FirstName}</Text>

                                {/* Last Name */}
                                <Text style = {globalStyles.label}>Last Name :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('LastName')}
                                    value = {props.values.LastName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.LastName && props.errors.LastName}</Text>

                                {/* Gender */}
                                <Text style = {globalStyles.label}>Gender :</Text>
                                {/* <Picker
                                    selectedValue = {props.values.Gender}
                                    onValueChange = {props.handleChange('Gender')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Gender' value = ''/>
                                    <Picker.Item label='Male' value = '1'/>
                                    <Picker.Item label='Female' value = '2'/>
                                </Picker> */}
                                <RadioForm
                                        style={{marginLeft: 10}}
                                        radio_props={radio_props}
                                        initial={this.state.gender}
                                        buttonSize={10}
                                        buttonOuterSize={20}
                                        buttonColor={'black'}
                                        buttonInnerColor={'black'}
                                        selectedButtonColor={'blue'}
                                        formHorizontal={false}
                                        onPress={(value) => this._changeGender(value,props.handleChange('Gender'))}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Gender && props.errors.Gender}</Text>

                                {/* DOB */}
                                <Text style = {globalStyles.label}>Date Of Birth :</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {this.state.dob}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOB')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOB}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
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
                                </View>}
                                
                                {this.state.pageTwo && <View>
                                    <View style={globalStyles.backgroundlogoimageview}>
                                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>
                                {/* Religion */}
                                <Text style = {globalStyles.label}>Religion :</Text>
                                <Picker
                                    selectedValue = {props.values.Religion}
                                    onValueChange = {value => {
                                        props.setFieldValue('Religion', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Religion' value = ''/>
                                    { 
                                        this.state.religions.map((item) => {
                                            return <Picker.Item key = {item.religionId} label = {item.religion} value = {item.religionId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Religion && props.errors.Religion}</Text>
                                
                                
                                
                                {/* Community */}
                                <Text style = {globalStyles.label}>Community :</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.Community && props.errors.Community}</Text>
                                

                                {/* Mother Tongue */}
                                <Text style = {globalStyles.label}>Mother Tongue :</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.MotherTongue && props.errors.MotherTongue}</Text>
                                

                                {/* Parental Status */}
                                <Text style = {globalStyles.label}>Parental Status :</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.ParentalStatus && props.errors.ParentalStatus}</Text>
                                

                                {/* Reason For Admission */}
                                <Text style = {globalStyles.label}>Reason For Admission :</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.ReasonForAdmission && props.errors.ReasonForAdmission}</Text>
                                

                                {/* Previous Education Status */}
                                <Text style = {globalStyles.label}>Previous Education Status :</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.PreviousEducationStatus && props.errors.PreviousEducationStatus}</Text>
                                

                                {/* Admitted By */}
                                <Text style = {globalStyles.label}>Admitted By :</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.AdmittedBy && props.errors.AdmittedBy}</Text>
                                
                                </View>}


                                {this.state.pageThree && <View>
                                    <View style={globalStyles.backgroundlogoimageview}>
                                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>
                                {/* DOA */}
                                <Text style = {globalStyles.label}>Date Of Admission :</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {this.state.doa}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOA')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOA}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
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
                                <Text style = {globalStyles.label}>Referred Source :</Text>
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
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredSource && props.errors.ReferredSource}</Text>
                                

                                {/* Referred By */}
                                <Text style = {globalStyles.label}>Referred By :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('ReferredBy')}
                                    value = {props.values.ReferredBy}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredBy && props.errors.ReferredBy}</Text>
                                

                                {/* Child Status */}
                                <Text style = {globalStyles.label}>Child Status :</Text>
                                <Picker
                                    selectedValue = {props.values.ChildStatus}
                                    onValueChange = {value => {
                                        props.setFieldValue('ChildStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Child Status' value = '' style={{borderColor: 'lightgreen'}}/>
                                    {
                                        this.state.childStatusList.map((item) => {
                                            return <Picker.Item key = {item.childStatusId} label = {item.childStatus} value = {item.childStatusId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildStatus && props.errors.ChildStatus}</Text>
                                

                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                </View>}
                                <View style={globalStyles.prevnext}>
                                    <View style={globalStyles.prevnextsubview}>
                                        <TouchableOpacity onPress={(event) => { this.changePage('prev') }}>
                                            <Text style={this.changeprevstyle()}>
                                                <Feather name="skip-back"/>Prev
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={globalStyles.prevnextsubview}>
                                        <TouchableOpacity onPress={(event) => { this.changePage('next')}}>
                                            <Text style={this.changenextstyle()}>
                                                Next<Feather name="skip-forward"/></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>  
                        </KeyboardAvoidingView>
                                                  
                    )}

                </Formik>
                {/* <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} >
                    <View style={globalStyles.MainContainer} isVisible={this.state.successDisplay}>
                        <Ionicons name="md-checkmark-circle" size={60} color="green" />
                        <Text style={globalStyles.text}>{this.state.submitAlertMessage}</Text>
                        <Button style = {globalStyles.modalButton} title="Okay!" onPress={this.modalclickOKSuccess}></Button>
                    </View>
                    <View style={globalStyles.MainContainer} isVisible={this.state.errorDisplay}>
                        <Ionicons name="md-warning" size={60} color="red" />``
                        <Text style={globalStyles.text}>{this.state.submitAlertMessage}</Text>
                        <Button style = {globalStyles.modalButton} title="Okay!" onPress={this.modalclickOKError}></Button>
                    </View>
                </Modal> */}
            </View>
        );
    }
}