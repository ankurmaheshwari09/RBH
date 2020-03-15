import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import React from 'react';
import { Button, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as yup from "yup";
import { globalStyles } from "../styles/global";
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';

const followUpSchema = yup.object({
    followUpBy: yup.string().required(),
    date: yup.string().required(),
    comments: yup.string().required(),
});

export default class FollowUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,     
            show: false,
            text: 'hi',
            child: this.props.navigation.getParam('child')
        }
        this.pickDob = this.pickDob.bind(this);
        
    }

    pickDob = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('DD/MM/YYYY');
        console.log(a);
        console.log(typeof (a));
        this.setState({ date: a, show: false });
        handleChange(a);
    }

    showDatepicker = () => {
        this.setState({ show: true });

    };


    render() {

        return (
            <View style={globalStyles.container}>
                
                <Formik
                    initialValues={{
                        followUpBy: '',
                        date: '',
                        comments: ''
                    }}
                    validationSchema={followUpSchema}
                    onSubmit={(values, actions) => {                                          
                            console.log(values);
                            actions.resetForm();
                            this.setState({ date: null , text: ''});
                            alert("Data submitted Successfully");                       
                    }}

                >
                    {(props) => (
                        <KeyboardAvoidingView behavior="padding"
                            enabled style={globalStyles.keyboardavoid}
                            keyboardVerticalOffset={200}>

                            <ScrollView>
                                <View>

                                    <Text style={globalStyles.text}>FollowUp By:</Text>
                                    <Picker
                                        selectedValue={props.values.followUpBy}
                                        style={globalStyles.dropDown}
                                        //                                style={{height: 50, width: 100}}
                                        onValueChange={(follwUpBy) => { this.setState({ followUpByError: false }); props.setFieldValue('followUpBy', follwUpBy) }}
                                        value={props.values.followUpBy}>
                                        <Picker.Item label="Select Staff " value="" />
                                        <Picker.Item label="Ratna" value="Ratna" />
                                        <Picker.Item label="Babu" value="Babu" />
                                        <Picker.Item label="Swapna" value="Swapna" />
                                        <Picker.Item label="Raju" value="Raju" />
                                    </Picker>
                                    < Text style={globalStyles.errormsg}>{props.touched.followUpBy && props.errors.followUpBy}</Text> 

                                    <Text style={globalStyles.text}>Date:</Text>
                                    <View style={globalStyles.dateView}>
                                        <TextInput
                                            style={globalStyles.inputText}

                                            value={this.state.date}
                                            editable={false}
                                            onValueChange={props.handleChange('date')}
                                        />
                                        <TouchableHighlight onPress={this.showDatepicker}>
                                            <View>
                                                <Feather style={globalStyles.dateBtn} name="calendar" />
                                            </View>
                                        </TouchableHighlight>
                                        {/* <Button style= {addChildStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                        <Text style={globalStyles.errormsg}>{props.touched.date && props.errors.date}</Text>
                                        {this.state.show &&
                                            <DateTimePicker
                                                style={{ width: 200 }}
                                                mode="date" //The enum of date, datetime and time
                                                value={new Date()}
                                                mode={'date'}
                                                onChange={(e, date) => { this.pickDob(e, date, props.handleChange('date')) }}
                                            />
                                        }
                                    </View>
                                    <Text style={globalStyles.text}>Comments:</Text>

                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('comments')}
                                        multiline={true}
                                        numberOfLines={10}
                                        value={props.values.comments} //value updated in 'values' is reflected here
                                    />
                                    < Text style={globalStyles.errormsg}>{props.touched.comments && props.errors.comments}</Text> 

                                    
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
const styles = StyleSheet.create({
    FontStyle: {
        fontSize: 15
    }
});
