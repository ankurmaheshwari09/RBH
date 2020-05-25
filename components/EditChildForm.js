import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Feather} from '@expo/vector-icons';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
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
//import RNFetchBlob from 'rn-fetch-blob'

const EditChildSchema = yup.object({
    // ChildPhoto: yup.object(),
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
        photoUploadMessage: ''
    };

    async _pickImage (handleChange) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if( status == 'granted'){
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

    createFormData = (photo) => {
        const data = new FormData();
      
        data.append("photo", {
          name: photo.fileName,
          type: photo.type,
          uri: photo.uri
        });      
        return data;
      };

    handleChoosePhoto = () => {
        const options = {
          noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
          if (response.uri) {
            this.setState({ photo: response })
          }
        })
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

    uploadImage(child){
        let photoUrl = base_url+"/upload-image/"+child.childNo;
        console.log(photoUrl);
        let imageUri = ''
        if(this.state.image == null) {
            imageUri= ''
        }
        else {
            imageUri = this.state.image;
        }
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "multipart/form-data;boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu");
        var formdata = new FormData();
        formdata.append("file", {
            uri: imageUri,
            name: `${child.childNo}.jpg`,
            type: `image/jpg`
          });
        var requestOptions = {
        method: 'PUT',
        body: formdata,
        headers: myHeaders,
        };

        fetch(photoUrl, requestOptions)
        .then((response) => {
            console.log(response.status)
            if(response.status == 200){
                this.setState({ loading: false, isVisible: true });
                this.setState({successDisplay: true})    
            }
            else{
                this.setState({ loading: false, isVisible: true });
                this.setState({ errorDisplay: true });
                throw Error(response.status);
            }
        }).catch(error => {
            this.setState({ loading: false, isVisible: true });
            this.setState({ errorDisplay: true });
        });
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
            if(response.ok){
                response.json().then((res) => {
                    this.uploadImage(child)
                }).catch(error => {
                    this.setState({ loading: false, isVisible: true });
                    this.setState({ errorDisplay: true });
                });
            }
            else{
                this.setState({ loading: false, isVisible: true });
                this.setState({ errorDisplay: true });
                throw Error(response.status);
            }
        }).catch(error => {
            this.setState({ loading: false, isVisible: true });
            this.setState({ errorDisplay: true });
        });
    }

    render() {
        
        return (
            <View style = {globalStyles.container}>
                

                <Formik
                initialValues = {
                    {
                        ChildPhoto: '',
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

                                <Text style = {globalStyles.text}>Child Image:</Text>
                                {
                                    <Image source={{ uri: this.state.image }} style={globalStyles.uploadImage} />
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildPhoto && props.errors.ChildPhoto}</Text>
                                <Button title="Upload Photo" onPress={() => this._pickImage(props.handleChange('ChildPhoto'))} />

                        

                                {/* First Name */}
                                <Text style = {globalStyles.text}>FirstName:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('FirstName')}
                                    value = {props.values.FirstName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.FirstName && props.errors.FirstName}</Text>

                                {/* Last Name */}
                                <Text style = {globalStyles.text}>LastName:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('LastName')}
                                    value = {props.values.LastName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.LastName && props.errors.LastName}</Text>

                                {/* Gender */}
                                <Text style = {globalStyles.text}>Gender:</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Gender && props.errors.Gender}</Text>
                                <Picker
                                    selectedValue = {props.values.Gender}
                                    onValueChange = {props.handleChange('Gender')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Gender' value = ''/>
                                    <Picker.Item label='Male' value = '1'/>
                                    <Picker.Item label='Female' value = '2'/>
                                </Picker>

                                {/* DOB */}
                                <Text style = {globalStyles.text}>Date Of Birth:</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {props.values.DOB}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOB')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOB}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
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
                                <Text style = {globalStyles.text}>Religion:</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.Religion && props.errors.Religion}</Text>
                                <Picker
                                    selectedValue = {props.values.Religion}
                                    onValueChange = {value => {
                                        props.setFieldValue('Religion', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Religion' value = ''/>
                                    { 
                                        global.religions.map((item) => {
                                            return <Picker.Item key = {item.religionId} label = {item.religion} value = {item.religionId}/>
                                        })
                                    }
                                </Picker>

                                {/* Community */}
                                <Text style = {globalStyles.text}>Community:</Text>
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
                                <Text style = {globalStyles.text}>Mother Tongue:</Text>
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
                                <Text style = {globalStyles.text}>Parental Status:</Text>
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
                                <Text style = {globalStyles.text}>Reason For Admission:</Text>
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
                                <Text style = {globalStyles.text}>Previous Education Status:</Text>
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
                                <Text style = {globalStyles.text}>Admitted By:</Text>
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
                                <Text style = {globalStyles.text}>Date Of Admission:</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {props.values.DOA}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOA')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOA}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
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
                                <Text style = {globalStyles.text}>Referred Source:</Text>
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
                                <Text style = {globalStyles.text}>Referred By:</Text>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredBy && props.errors.ReferredBy}</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('ReferredBy')}
                                    value = {props.values.ReferredBy}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />

                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
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