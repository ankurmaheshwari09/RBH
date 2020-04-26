import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView, StyleSheet, Dimensions
} from 'react-native';
import { Formik } from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';
import {base_url,getDataAsync} from '../constants/Base';
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
//import communicationConstants from '../constants/CommunicationConstants';

const CommunicationFormSchema = yup.object({
    PresentLocalAddress: yup.string().required(),
    Area: yup.string().required(),
    Country: yup.string().required(),
    State: yup.string().required(),
    District: yup.string().required(),
    Pincode: yup.string().required().matches(/^[0-9]{6}$/, 'Pincode is not valid'),
//    Pincode: yup.string().matches(/^[0-9]{6}$/, 'Pincode is not valid'),
    Phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid'),
    Mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number is not valid'),
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

    submitChildCommunicationForm(values) {
        let request_body = JSON.stringify({
            "phoneNo":values.Phone,
            "mobileNo":values.Mobile,
            "presentAddress1":values.PresentLocalAddress,
            "presentCity":values.Area,
            "presentCountry":values.Country,
            "presentStateRH":values.State,
            "presentDistrict":values.District,
            "presentPincode":values.Pincode,
            "permtAddress1":values.PermanentAddress,
        });
        this.setState({ loading: true });
        fetch(base_url+"/child-communication", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => {
               //response.json();
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

                <Formik
                    initialValues={
                        {
                            PresentLocalAddress: '',
                            Area: '',
                            Pincode: '',
                            Mobile: '',
                            Phone: '',
                            PermanentAddress: '',
                            Country: '',
                            State: '',
                            District: '',
                            // CWCStayReason: ''
                        }
                    }
                    validationSchema={CommunicationFormSchema}
                    onSubmit={(values, actions) => {
                        console.log(values);
                        this.submitChildCommunicationForm(values);
                        actions.resetForm();
                        //alert("Data Has been submitted")
                        //this.props.navigation.push('CommunicationScreen', values)

                    }}
                >
                    {props => (
//                        <KeyboardAvoidingView behavior="padding"
//                            enabled style={globalStyles.keyboardavoid}
//                            keyboardVerticalOffset={200}>
                            <ScrollView>

                                <View>
                                    <Text style={globalStyles.text}>Present(Local)Address Details(Street No/Name,Village Name)</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('PresentLocalAddress')}
                                        value={props.values.PresentLocalAddress}
                                    />
                                    <Text style={globalStyles.text}>Area/Town/City Name</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Area && props.errors.Area}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Area')}
                                        value={props.values.Area}
                                    />
                                    <Text style={globalStyles.text}>Country</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Country && props.errors.Country}</Text>
                                    <Picker
                                        selectedValue={props.values.Country}
                                        style={globalStyles.dropDown}
                                        onValueChange={value => {
                                           props.setFieldValue('Country', value)}}
                                        value={props.values.Country}
                                    >
                                        <Picker.Item key = '' label="Select Country" value="" />
                                        {
                                           this.state.countries.map((item) => {
                                               return <Picker.Item key = {item.countryId} label = {item.country} value = {item.countryId}/>
                                           })
                                         }
                                    </Picker>

                                    <Text style={globalStyles.text}>State</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.State && props.errors.State}</Text>
                                    <Picker
                                        selectedValue={props.values.State}
                                        style={globalStyles.dropDown}
                                        onValueChange={value => {
                                           props.setFieldValue('State', value)
                                        }}
                                    >
                                        <Picker.Item label="Select State" value="" />
                                        {
                                           this.state.states.map((item) => {
                                               return <Picker.Item key = {item.stateID} label = {item.state} value = {item.stateID}/>
                                           })
                                         }
                                     </Picker>
                                    <Text style={globalStyles.text}>District</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.District && props.errors.District}</Text>
                                    <Picker
                                        selectedValue={props.values.District}
                                        style={globalStyles.dropDown}
                                        onValueChange={value => {
                                           props.setFieldValue('District', value)}}
                                        value={props.values.District}
                                    >
                                        <Picker.Item label="Select District" value="0" />
                                        {
                                           this.state.districts.map((item) => {
                                              return <Picker.Item key = {item.districtID} label = {item.district} value = {item.districtID}/>
                                          })
                                         }
                                    </Picker>
                                    <Text style={globalStyles.text}>Pin Code</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Pincode && props.errors.Pincode}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Pincode')}
                                        value={props.values.Pincode}
                                    />
                                    <Text style={globalStyles.text}>Mobile Number</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Mobile && props.errors.Mobile}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Mobile')}
                                        value={props.values.Mobile}
                                    />
                                    <Text style={globalStyles.text}>Phone Number</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Phone && props.errors.Phone}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Phone')}
                                        value={props.values.Phone}
                                    />
                                    <Text style={globalStyles.text}>Permanent(Native) Address</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.PermanentAddress && props.errors.PermanentAddress}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('PermanentAddress')}
                                        value={props.values.PermanentAddress}
                                    />
                                    <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                </View>
                            </ScrollView>
//                        </KeyboardAvoidingView>
                    )}

                </Formik>
                <Modal style={Styles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={Styles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Communication Status' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'space-between',
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2 + 50,
        maxHeight: Dimensions.get('window').height / 4,
        top: 150,
        borderRadius: 30
    }
});