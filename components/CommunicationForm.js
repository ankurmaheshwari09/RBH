import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView, Image, TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { Formik } from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';
import {base_url,getDataAsync} from '../constants/Base';
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { Ionicons } from '@expo/vector-icons';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
//import communicationConstants from '../constants/CommunicationConstants';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';

const CommunicationFormSchema = yup.object({
    PresentAddress: yup.string().required(),
    Area: yup.string().required(),
    Country: yup.string().required(),
    showPresentDetailsError: yup.boolean(),
    State: yup.string().when('showPresentDetailsError', {
        is: true, then: yup.string().required("State is a required field")
    }),
    District: yup.string().when('showPresentDetailsError', {
        is: true, then: yup.string().required("District is a required field")
    }),
    Pincode: yup.string().when('showPresentDetailsError', {
        is: true, then: yup.string().required("PinCode is a required field").matches(/^[0-9]{6}$/, 'Enter 6 digit Pin Code')
    }),
//    Pincode: yup.string().matches(/^[0-9]{6}$/, 'Pincode is not valid'),
    Mobile: yup.string().matches(/^[0-9]{10}$/, 'Enter 10 digit mobile number'),
    Phone: yup.string().required("10 digit Phone No is a required field").matches(/^[0-9]{10}$/, 'Enter 10 digit Phone number'),
    PermanentAddress: yup.string(),
});

export default class CommunicationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            child: this.props.navigation.getParam('child'),
            isVisible: false,
            loading: false,
            errorDisplay: false,
            successDisplay: false,
            countries: [],
            states: [],
            districts: [],
            presentDistricts: [],
            showPresentState: false,
            showPresentDistrictAndPincode: false,
            // permtDistricts: [],
            // showPermtState: false,
            // showPermtDistrictAndPincode: false,
        }
    }

    async addChildCommunicationConstants(){
        getDataAsync(base_url + '/countries').then(data => { console.log(data); this.setState({countries: data}) });

        getDataAsync(base_url + '/states').then(data => { console.log(data); this.setState({states: data}) });

        getDataAsync(base_url + '/districts').then(data => { console.log(data); this.setState({districts: data}) });
    }

    componentDidMount() {
        this.addChildCommunicationConstants();
    }

    getPresentDistricts(value)  {
        this.setState({presentDistricts:[]});
        let presentDistricts = [];
        this.state.districts.map((item) => {
            if(item.stateID == value){
                presentDistricts.push(item);
           }
        });
        this.setState({presentDistricts:presentDistricts})
//        console.log(this.state.presentDistricts);
    }

    submitChildCommunicationForm(values) {
        let request_body = JSON.stringify({
            "phoneNo":values.Phone,
            "mobileNo":values.Mobile,
            "presentAddress1":values.PresentAddress,
            // "presentAddress2": null,
            "presentCity":values.Area,
            "presentCountry":values.Country,
            "presentStateRH":values.State,
            "presentDistrict":values.District,
            "presentPincode":values.Pincode,
            "permtAddress1":values.PermanentAddress,
            // "permtAddress2":null,
            // "permtCountry":values.PermtCountry,
            // "permtStateRH":values.PermtState
            // "permtDistrict":values.PermtDistrict,
            // "permtPincode":values.PermtPincode,

        });
        this.setState({ loading: true });
        fetch(base_url+"/child-communication", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: request_body,
        })
        .then((response) => {
//               response.json();
               console.log('Communication Form Status and Response are', response.status, 'and', response.ok);
               this.setState({ loading: false, isVisible: true, });
               if (response.ok) {
                   response.json().then((res) => {
                       console.log(res);
                   });
                   this.setState({ successDisplay: true });
//                   this.setState({submitAlertMessage: 'Successfully added child communication details'});
//                   alert(this.state.submitAlertMessage);
               } else {
                   throw Error(response.status);
               }
        })
//        .then((responseJson) => {
//            console.log(responseJson);
//            this.setState({ successDisplay: true });
//        })
        .catch((error) => {
            console.log(error);
            this.setState({ errorDisplay: true });
//            this.setState({submitAlertMessage: 'Unable to add child communication details. Please contact the Admin.'});
//            alert(this.state.submitAlertMessage);
        });
    }

    render() {
        return (
            <View style={globalStyles.container}>
             <View style={globalStyles.backgroundlogoimageview}>
                <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
             </View>
                <Formik
                    initialValues={
                        {
                            PresentAddress: '',
                            Area: '',
                            Pincode: '',
                            Mobile: '',
                            Phone: '',
                            PermanentAddress: '',
                            Country: '',
                            State: '',
                            District: '',
                            showPresentDetailsError: false
//                            CWCStayReason: ''
                        }
                    }
                    validationSchema={CommunicationFormSchema}
                    onSubmit={(values, actions) => {
                        console.log(values);
                        this.submitChildCommunicationForm(values);
                        actions.resetForm();
//                        props.setFieldValue({'showPresentDetailsError':false});
                        this.setState({presentDistricts:[], showPresentState:false, showPresentDistrictAndPincode:false, isVisible:false, loading:false, errorDisplay:false, successDisplay:false})
//                        alert("Data Has been submitted")
//                        this.props.navigation.push('CommunicationScreen', values)

                    }}
                >
                    {props => (
//                        <KeyboardAvoidingView behavior="padding"
//                            enabled style={globalStyles.keyboardavoid}
//                            keyboardVerticalOffset={200}>
                            <ScrollView showsVerticalScrollIndicator = {false}>

                                <View>
                                    <Text style={globalStyles.label}>Present(Local)Address Details:{"\n"}(Street No/Name,Village Name) <Text style={{ color: "red" }}>*</Text> </Text>

                                    <TextInput
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('PresentAddress')}
                                        value={props.values.PresentAddress}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.PresentAddress && props.errors.PresentAddress}</Text>
                                    <Text style={globalStyles.label}>Area/Town/City Name: <Text style={{ color: "red" }}>*</Text> </Text>

                                    <TextInput
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('Area')}
                                        value={props.values.Area}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.Area && props.errors.Area}</Text>
                                    <Text style={globalStyles.label}>Country: <Text style={{ color: "red" }}>*</Text> </Text>

                                    <Picker
                                        selectedValue={props.values.Country}
                                        style={globalStyles.dropDown}
                                        onValueChange={value => {
                                           props.setFieldValue('Country', value);
                                           if(value==1){
                                                props.setFieldValue('showPresentDetailsError', true);
                                                this.setState({showPresentState: true});
                                           } else{
                                                props.setFieldValue('showPresentDetailsError', false);
                                                this.setState({showPresentState:false});
                                                props.setFieldValue('State','');
                                                props.setFieldValue('District','');
                                                props.setFieldValue('Pincode','');
                                           }
                                           this.setState({showPresentDistrictAndPincode:false});
                                        }}
                                        value={props.values.Country}
                                    >
                                        <Picker.Item key = '' label="Select Country" color = "grey" value='' />
                                        {
                                           this.state.countries.map((item) => {
                                               return <Picker.Item key = {item.countryId} label = {item.country} value = {item.countryId}/>
                                           })
                                        }
                                    </Picker>
                                    <Text style={globalStyles.errormsg}>{props.touched.Country && props.errors.Country}</Text>
                                    {this.state.showPresentState ?
                                        <View>
                                        <Text style={globalStyles.label}>State: <Text style={{ color: "red" }}>*</Text> </Text>
                                        <Text style={globalStyles.errormsg}>{props.touched.State && props.errors.State}</Text>
                                        <Picker
                                            selectedValue={props.values.State}
                                            style={globalStyles.dropDown}
                                            onValueChange={(value) => {
                                                props.setFieldValue('State', value);
                                                console.log("state has been updated to "+ value);
                                                props.setFieldValue('District','');
                                                props.setFieldValue('Pincode','');
                                                if(value!=''){
                                                    this.getPresentDistricts(value);
                                                    this.setState({showPresentDistrictAndPincode: true});
                                                }
                                                else{
                                                    this.setState({showPresentDistrictAndPincode: false});
                                                }
                                            }}
                                            value={props.values.State}
                                        >
                                            <Picker.Item color = "grey" label="Select State" value='' />
                                            {
                                               this.state.states.map((item) => {
                                                   return <Picker.Item key = {item.stateID} label = {item.state} value = {item.stateID}/>
                                               })
                                            }
                                         </Picker>
                                         </View>
                                    :null}

                                    {this.state.showPresentDistrictAndPincode ?
                                        <View>
                                        <Text style={globalStyles.label}>District: <Text style={{ color: "red" }}>*</Text> </Text>

                                        <Picker
                                            selectedValue={props.values.District}
                                            style={globalStyles.dropDown}
                                            onValueChange={value => {
//                                               console.log(this.state.presentDistricts);
                                               props.setFieldValue('District', value);
                                               props.setFieldValue('Pincode','');
                                               console.log("district has been updated to "+ value);
                                            }}
                                            value={props.values.District}
                                        >
                                            <Picker.Item color= "grey" label="Select District" value='' />
                                            {
                                               this.state.presentDistricts.map((item) => {
                                                  return <Picker.Item key = {item.districtID} label = {item.district} value = {item.districtID}/>
                                              })
                                            }
                                        </Picker>
                                        <Text style={globalStyles.errormsg}>{props.touched.District && props.errors.District}</Text>
                                        <Text style={globalStyles.text}>Pin Code: <Text style={{ color: "red" }}>*</Text> </Text>

                                        <TextInput
                                            style={globalStyles.inputText}
                                            onChangeText={props.handleChange('Pincode')}
                                            value={props.values.Pincode}
                                        />
                                        <Text style={globalStyles.errormsg}>{props.touched.Pincode && props.errors.Pincode}</Text>
                                        </View>
                                    :null}

                                    <Text style={globalStyles.text}>Mobile Number(Personal):</Text>

                                    <TextInput
                                        keyboardType = 'numeric'
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('Mobile')}
                                        value={props.values.Mobile}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.Mobile && props.errors.Mobile}</Text>
                                    <Text style={globalStyles.text}>Phone Number(Relatives/Neighbours): <Text style={{ color: "red" }}>*</Text> </Text>

                                    <TextInput
                                        keyboardType = 'numeric'
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('Phone')}
                                        value={props.values.Phone}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.Phone && props.errors.Phone}</Text>
                                    <Text style={globalStyles.text}>Permanent(Native) Address:</Text>

                                    <TextInput
                                        style={globalStyles.inputText}
                                        onChangeText={props.handleChange('PermanentAddress')}
                                        value={props.values.PermanentAddress}
                                        multiline={true}
                                    />
                                    <Text style={globalStyles.errormsg}>{props.touched.PermanentAddress && props.errors.PermanentAddress}</Text>
                                    <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                </View>
                            </ScrollView>
//                        </KeyboardAvoidingView>
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
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Communication Status' childNo={this.state.child.firstName} />
                  </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}

// const Styles = StyleSheet.create({
//     MainContainer: {
//         justifyContent: 'space-between',
//         flex: 1,
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         alignSelf: 'center',
//         backgroundColor: 'white',
//         width: Dimensions.get('window').width / 2 + 50,
//         maxHeight: Dimensions.get('window').height / 4,
//         top: 150,
//         borderRadius: 30
//     }
// });
