import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/global';
import * as yup from 'yup';

const CommunicationFormSchema = yup.object({
    PresentLocalAddress: yup.string().required(),
    Area: yup.string().required(),
    Country: yup.string().required(),
    State: yup.string().required(),
    District: yup.string().required(),
    Pincode: yup.string().matches(/^[0-9]{6}$/, 'Pincode is not valid'),
    Phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid'),
    Mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number is not valid'),
    PermanentAddress: yup.string(),
})

export default class CommunicationForm extends React.Component {
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
                        actions.resetForm();
                        console.log(values);
                        alert("Data Has been submitted")
                        this.props.navigation.push('CommunicationScreen', values)

                    }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior="padding"
                            enabled style={globalStyles.keyboardavoid}
                            keyboardVerticalOffset={200}>
                            <ScrollView>

                                <View>
                                    <Text style={globalStyles.text}>Present(Local)Address(Street No/Name,Village Name)</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('PresentLocalAddress')} //This will update the IdentificationMArk value in 'values'
                                        value={props.values.PresentLocalAddress} //value updated in 'values' is reflected here
                                    />
                                    <Text style={globalStyles.text}>Area/Town/City</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Area && props.errors.Area}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Area')} //This will update the IdentificationMArk value in 'values'
                                        value={props.values.Area} //value updated in 'values' is reflected here
                                    />
                                    <Text style={globalStyles.text}>Country</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Country && props.errors.Country}</Text>
                                    <Picker
                                        selectedValue={props.values.Country}
                                        style={globalStyles.dropDown}
                                        onValueChange={props.handleChange('Country')}
                                        value={props.values.Country}
                                    >
                                        <Picker.Item label="Select Country" value="" />
                                        <Picker.Item label="India" value="India" />
                                        <Picker.Item label="Bangladesh" value="Bangladesh" />
                                        <Picker.Item label="Bhutan" value="Bhutan" />
                                        <Picker.Item label="Maldives" value="Maldives" />
                                        <Picker.Item label="Nepal" value="Nepal" />
                                        <Picker.Item label="Pakistan" value="Pakistan" />
                                        <Picker.Item label="Srilanka" value="Srilanka" />
                                    </Picker>

                                    <Text style={globalStyles.text}>State</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.State && props.errors.State}</Text>
                                    <Picker
                                        selectedValue={props.values.State}
                                        style={globalStyles.dropDown}
                                        onValueChange={props.handleChange('State')}
                                    >
                                        <Picker.Item label="Select State" value="" />
                                        <Picker.Item label="Delhi" value="Delhi" />
                                        <Picker.Item label="Goa" value="Goa" />
                                        <Picker.Item label="Gujarat" value="Gujarat" />
                                        <Picker.Item label="Haryana" value="Haryana" />
                                        <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
                                    </Picker>
                                    <Text style={globalStyles.text}>District</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.District && props.errors.District}</Text>
                                    <Picker
                                        selectedValue={props.values.District}
                                        style={globalStyles.dropDown}
                                        onValueChange={props.handleChange('District')}
                                        value={props.values.District}
                                    >
                                        <Picker.Item label="Select District" value="" />
                                        <Picker.Item label="Guntur" value="Guntur" />
                                        <Picker.Item label="Krishna" value="Krishna" />
                                        <Picker.Item label="Kurnool" value="Kurnool" />
                                        <Picker.Item label="Visakhapatnam" value="Visakhapatnam" />
                                        <Picker.Item label="Krishna" value="Krishna" />
                                        <Picker.Item label="Prakasam" value="Prakasam" />
                                    </Picker>
                                    <Text style={globalStyles.text}>Pin Code</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Pincode && props.errors.Pincode}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Pincode')} //This will update the IdentificationMArk value in 'values'
                                        value={props.values.Pincode} //value updated in 'values' is reflected here
                                    />
                                    <Text style={globalStyles.text}>Mobile</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Mobile && props.errors.Mobile}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Mobile')} //This will update the IdentificationMArk value in 'values'
                                        value={props.values.Mobile} //value updated in 'values' is reflected here
                                    />
                                    <Text style={globalStyles.text}>Phone</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.Phone && props.errors.Phone}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Phone')} //This will update the IdentificationMArk value in 'values'
                                        value={props.values.Phone} //value updated in 'values' is reflected here
                                    />
                                    <Text style={globalStyles.text}>Permanent(Native) Address</Text>
                                    <Text style={globalStyles.errormsg}>{props.touched.PermanentAddress && props.errors.PermanentAddress}</Text>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('PermanentAddress')} //This will update the IdentificationMArk value in 'values'
                                        value={props.values.PermanentAddress} //value updated in 'values' is reflected here
                                    />
                                    <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>

                    )}

                </Formik>

            </View>
        );
    }
}
