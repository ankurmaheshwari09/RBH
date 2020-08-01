import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
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
import {buildTestImageName, buildProdImageName} from '../constants/ChildConstants';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import {guidGenerator} from '../constants/Base';
import { Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';
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
        actualChild: this.props.childData,
        image : null,
        showdob: false,
        showdoa: false,
        orgid: '',
        sucessDisplay: false,
        errorDisplay: false,
        loading: false,
        isVisible: false,
        loadChildList: false,
        age: '',
        homecode: ''
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
        let a = moment(date).format('YYYY-MM-DD');
        this.setState({dob:a, showdob: false});
        let today = new Date();
        let b = moment(today);
        var age = moment.duration(b.diff(a));
        var years = age.years();
        var months = age.months();
        var days = age.days();
        var ageResult = years+" years "+months+" months "+days+" days";
        this.setState({age:ageResult});
        handleChange(a);
    }

    _pickDoa = (event,date,handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
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

    componentWillUnmount() {
        if (this.state.loadChildList) {
            this.props.navigation.navigate('ViewChild');
            const { params } = this.props.navigation.state;
            params.refreshChildList();
            // const { params } = this.props.navigation.state;
            // params.refreshChildList();
        }
    }

    handleLoadChildList(child, actualChild){
        if(actualChild.firstName !== child.FirstName || actualChild.lastName !== child.LastName
            || this.getDate(actualChild.dateOfBirth) !== child.DOB || this.getDate(actualChild.admissionDate) !== child.DOA
            || this.state.image){
                this.setState({loadChildList: true})
        }
    }

    _submitEditChildForm(child, values, actualChild) {
        let path = `child/${child.childNo}`
        UpdateApi.updateData(JSON.stringify(child), path).then((response) => {
        if(response.ok){
            response.json().then((res) => {
                this.setState({successDisplay: true})
                this.handleLoadChildList(values, actualChild)
                this.setState({ loading: false, isVisible: true });
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

    _submiChild(values){
        this.setState({ loading: true });
        let actualChild = {}
        Object.assign(actualChild, this.props.childData)
        let child = this.props.childData
        child.firstName = values.FirstName
        child.lastName = values.LastName
        child.gender = values.Gender
        child.dateOfBirth = values.DOB
        child.religion = values.Religion
        child.community = values.Community
        child.motherTongue = values.MotherTongue
        child.parentalStatus = values.ParentalStatus
        child.reasonForAdmission = values.ReasonForAdmission
        child.educationStatus = values.PreviousEducationStatus
        child.admissionDate = values.DOA
        child.admittedBy = values.AdmittedBy
        child.referredBy = values.ReferredBy
        child.referredSource = values.ReferredSource
        let dob = moment(values.DOB);
        let doa = moment(values.DOA);
        console.log(doa.isBefore(values.DOB));
        let diff = doa.diff(dob,'years',true);
        if(doa.isBefore(values.DOB)) {
            Alert.alert(
                'To Edit Child',
                'Date of Admission cannt be before Date of Birth',
                        [
                            { text: 'OK', onPress: () => {} },
                        ],
                    { cancelable: false },
            ); 
        }
        else if(diff < 2) {
                Alert.alert(
                    'To Edit Child Information',
                    'Child age should be atleast 2 years',
                    [
                        { text: 'OK', onPress: () => {} },
                    ],
                    { cancelable: false },
            ); 
            this.setState({ loading: false});
        }
        else{
            let imageUri = ''
            if(this.state.image == null) {
                imageUri= ''
            }
            else {
                imageUri = this.state.image;
            }
            if(imageUri !== '')
            {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "multipart/form-data;boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu");
                myHeaders.append('Authorization', 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`));
                var formdata = new FormData();
                let imageName = buildTestImageName(child.childNo, child.firstName);
                let photoUrl = base_url+"/upload-image/"+child.childNo + imageName;
                console.log(photoUrl);
                formdata.append("file", {
                    uri: imageUri,
                    name: `${imageName.split('/')[2]}.jpg`,
                    type: `image/jpg`
                });
                var requestOptions = {
                method: 'PUT',
                body: formdata,
                headers: myHeaders,
                };
                fetch(photoUrl, requestOptions)
                .then((response) => {
                    if(response.status == 200){
                        console.log(response.status)
                        child.picture = imageName.split('/')[2];
                        let path = `child/${child.childNo}`
                        UpdateApi.updateData(JSON.stringify(child), path).then((response) => {
                            if(response.ok){
                                response.json().then((res) => {
                                    this.setState({successDisplay: true})
                                    this.handleLoadChildList(values, actualChild)
                                    this.setState({ loading: false, isVisible: true });
                                }).catch(error => {
                                    this.setState({ loading: false, isVisible: true });
                                    this.setState({ errorDisplay: true });
                                });
                            }
                            else{
                                throw Error(response.status);
                            }
                        })     
                    }
                    else{
                        this.setState({ errorDisplay: true });
                        throw Error(response.status);
                    }
                }).catch(error => {
                    this.setState({ loading: false, isVisible: true });
                    this.setState({ errorDisplay: true });
                });
            }
            else
            {
                this._submitEditChildForm(child, values, actualChild)
            }
        }
        
        
    }

    render() {
        
        return (
            <View style = {globalStyles.scrollContainer}>
                

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
                        ReasonForAdmission: this.state.child.reasonForAdmission ? parseInt(this.state.child.reasonForAdmission) : '',
                        PreviousEducationStatus: this.state.child.educationStatus ? this.state.child.educationStatus : '',
                        AdmittedBy: this.state.child.admittedBy ? parseInt(this.state.child.admittedBy) : '',
                        ReferredSource: this.state.child.referredSource ? parseInt(this.state.child.referredSource) : '',
                        ReferredBy: this.state.child.referredBy ? this.state.child.referredBy : '',
                        //ChildStatus: this.state.child.childStatus ? this.state.child.childStatus : '',
                    }
                }
                validationSchema = {EditChildSchema}
                onSubmit = {async (values, actions) => {
                    console.log("Submit method called here ");
                    let result = this._submiChild(values);
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

                                <Text style = {globalStyles.label}>Child Image:</Text>
                                {
                                    <Image source={{ uri: this.state.image }} style={globalStyles.uploadImage} />
                                }
                                <Button title="Upload New Photo" onPress={() => this._pickImage(props.handleChange('ChildPhoto'))} />
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildPhoto && props.errors.ChildPhoto}</Text>
                        

                                {/* First Name */}
                                <Text style = {globalStyles.label}>First Name<Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('FirstName')}
                                    value = {props.values.FirstName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.FirstName && props.errors.FirstName}</Text>

                                {/* Last Name */}
                                <Text style = {globalStyles.label}>Last Name<Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('LastName')}
                                    value = {props.values.LastName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.LastName && props.errors.LastName}</Text>

                                {/* Gender */}
                                <Text style = {globalStyles.label}>Gender<Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.Gender}
                                    onValueChange = {props.handleChange('Gender')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Gender' value = ''/>
                                    <Picker.Item label='Male' value = '1'/>
                                    <Picker.Item label='Female' value = '2'/>
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Gender && props.errors.Gender}</Text>

                                {/* DOB */}
                                <Text style = {globalStyles.label}>Date Of Birth<Text style={{color:"red"}}>*</Text> :</Text>
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
                                            maximumDate= { new Date((new Date()).setDate((new Date()).getDate() - 1)) }
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.DOB && props.errors.DOB}</Text>

                                {/* Age */}
                                <Text style = {globalStyles.label}>Age <Text style={{color:"red"}}>*</Text> :</Text>
                                 <TextInput
                                     style = {globalStyles.inputText}
                                     value = {this.state.age}
                                     editable= {false}
                                 />
                                 <Text style = {globalStyles.errormsg}>{props.touched.ChildStatus && props.errors.ChildStatus}</Text>

                                {/* Religion */}
                                <Text style = {globalStyles.label}>Religion<Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.Religion}
                                    onValueChange = {value => {
                                        props.setFieldValue('Religion', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Religion' value = ''/>
                                    { 
                                        global.religions.map((item) => {
                                            return <Picker.Item key = {item.religionId} label = {item.religion} value = {item.religionId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Religion && props.errors.Religion}</Text>

                                {/* Community */}
                                <Text style = {globalStyles.label}>Community<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                    selectedValue = {props.values.Community}
                                    onValueChange = {value => {
                                        props.setFieldValue('Community', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Community' value = ''/>
                                    {
                                        global.communities.map((item) => {
                                            return <Picker.Item key = {item.communityId} label = {item.community} value = {item.communityId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Community && props.errors.Community}</Text>

                                {/* Mother Tongue */}
                                <Text style = {globalStyles.label}>Mother Tongue<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                    selectedValue = {props.values.MotherTongue}
                                    onValueChange = {value => {
                                        props.setFieldValue('MotherTongue', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Mother Tongue' value = ''/>
                                    {
                                        global.motherTongues.map((item) => {
                                            return <Picker.Item key = {item.motherTongueId} label = {item.motherTongue} value = {item.motherTongueId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.MotherTongue && props.errors.MotherTongue}</Text>

                                {/* Parental Status */}
                                <Text style = {globalStyles.label}>Parental Status<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                    selectedValue = {props.values.ParentalStatus}
                                    onValueChange = {value => {
                                        props.setFieldValue('ParentalStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Parental Status' value = ''/>
                                    {
                                        global.parentalStatusList.map((item) => {
                                            return <Picker.Item key = {item.parentalStatusId} label = {item.parentalStatus} value = {item.parentalStatusId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ParentalStatus && props.errors.ParentalStatus}</Text>

                                {/* Reason For Admission */}
                                <Text style = {globalStyles.label}>Reason For Admission<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                    selectedValue = {props.values.ReasonForAdmission}
                                    onValueChange = {value => {
                                        props.setFieldValue('ReasonForAdmission', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Reason For Admission' value = ''/>
                                    {
                                        global.admissionReasons.map((item) => {
                                            return <Picker.Item key = {item.reasonForAdmissionId} label = {item.reasonForAdmission} value = {item.reasonForAdmissionId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReasonForAdmission && props.errors.ReasonForAdmission}</Text>

                                {/* Previous Education Status */}
                                <Text style = {globalStyles.label}>Previous Education Status<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                    selectedValue = {props.values.PreviousEducationStatus}
                                    onValueChange = {value => {
                                        props.setFieldValue('PreviousEducationStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Previous Education Status' value = ''/>
                                    {
                                        global.educationStatusList.map((item) => {
                                            return <Picker.Item key = {item.educationStatusId} label = {item.educationStatus} value = {item.educationStatusId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.PreviousEducationStatus && props.errors.PreviousEducationStatus}</Text>

                                {/* Admitted By */}
                                <Text style = {globalStyles.label}>Admitted By<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                    selectedValue = {props.values.AdmittedBy}
                                    onValueChange = {value => {
                                        props.setFieldValue('AdmittedBy', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Admitted By' value = ''/>
                                    {
                                        global.staff.map((item) => {
                                            return <Picker.Item key={item.staffNo} label={item.firstName} value={item.staffNo} />
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.AdmittedBy && props.errors.AdmittedBy}</Text>

                                {/* DOA */}
                                <Text style = {globalStyles.label}>Date Of Admission<Text style={{color:"red"}}>*</Text>:</Text>
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
                                            maximumDate= { new Date((new Date()).setDate((new Date()).getDate() - 1)) }
                                            minimumDate= { new Date((new Date()).setDate((new Date()).getDate() - 3)) }
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.DOA && props.errors.DOA}</Text>

                                {/* Referred Source */}
                                <Text style = {globalStyles.label}>Referred Source<Text style={{color:"red"}}>*</Text>:</Text>
                                <Picker
                                    selectedValue = {props.values.ReferredSource}
                                    onValueChange = {value => {
                                        props.setFieldValue('ReferredSource', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item color = 'grey' label='Select Referred Source' value = ''/>
                                    {
                                        global.referralSourcesList.map((item) => {
                                            return <Picker.Item key = {item.referralSourceId} label = {item.referralSource} value = {item.referralSourceId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredSource && props.errors.ReferredSource}</Text>

                                {/* Referred By */}
                                <Text style = {globalStyles.label}>Referred By<Text style={{color:"red"}}>*</Text>:</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('ReferredBy')}
                                    value = {props.values.ReferredBy}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredBy && props.errors.ReferredBy}</Text>
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
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Child Info' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}