import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import React from 'react';
import { Button, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as yup from "yup";
import { globalStyles } from "../styles/global";
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';


const statusSchema = yup.object({
    childStatus: yup.string().required(),
    date: yup.string().required(),
    approvedBy: yup.string().required(),
});

export default class StatusScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            showElements: false,
            show: false,
            leavingReasonError: false,
            reasonDescriptionError: false,
            leftPlaceError: false,
            actionTakenError: false,
            stayError: false,
            followUpByError: false,
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
        const radio_props = [
            {
                label: 'Child Exits',
                value: 'exit'
            },
            {
                label: 'Child Moves To Future Program',
                value: 'futureProgram'
            }
        ];
        return (
            <View style={globalStyles.container}>
                <View >
                     
                    <Text> Child Name: {this.state.child.firstName}</Text>
                </View>  
                <Formik
                    initialValues={{
                        childStatus: '',
                        date: '',
                        approvedBy: '',
                        leavingReason: '',
                        reasonDescription: '',
                        leftPlace: '',
                        actionTaken: '',
                        stay: '',
                        followUpBy: '',
                        credentials: ''
                    }}
                    validationSchema={statusSchema}
                    onSubmit={(values, actions) => {
                        console.log(values.leavingReason);
                        if (values.leavingReason == '' && this.state.showElements == true) {
                            this.setState({ leavingReasonError: true });
                        } if (values.reasonDescription == '' && this.state.showElements == true) {
                            this.setState({ reasonDescriptionError: true });
                        } if (values.leftPlace == '' && this.state.showElements == true) {
                            this.setState({ leftPlaceError: true });
                        } if (values.actionTaken == '' && this.state.showElements == true) {
                            this.setState({ actionTakenError: true });
                        } if (values.stay == '' && this.state.showElements == true) {
                            this.setState({ stayError: true });
                        } if (values.followUpBy == '' && this.state.showElements == true) {
                            this.setState({ followUpByError: true });
                        }
                        if (!(this.state.leavingReasonError || this.state.reasonDescriptionError || this.state.leftPlaceError || this.state.actionTakenError || this.state.stayError || this.state.followUpByError)) {
                            console.log(values);
                            actions.resetForm();
                            this.setState({ date: null, showElements: false, leavingReasonError: false, reasonDescriptionError: false, leftPlaceError: false, actionTakenError: false, stayError: false, followUpByError: false, credentialsError: false });
                            alert("Data submitted Successfully");
                        }
                    }}

                >
                    {(props) => (
                        <KeyboardAvoidingView behavior="padding"
                            enabled style={globalStyles.keyboardavoid}
                            keyboardVerticalOffset={200}>

                            <ScrollView>
                                <View>
                                   
                                    <Text style={globalStyles.text}>Child Status:</Text>
                                    <Picker
                                        selectedValue={props.values.childStatus}
                                        style={globalStyles.dropDown}
                                        //                                style={{height: 50, width: 100}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('childStatus', itemValue)
                                            if (itemValue == 'closed') {
                                                this.setState({ showElements: true })
                                            } else {
                                                this.setState({ showElements: false })
                                            }
                                        }}

                                        value={props.values.childStatus}>
                                        <Picker.Item label="Select Status" value="" />
                                        <Picker.Item label="Observation" value="observation" />
                                        <Picker.Item label="Present" value="present" />
                                        <Picker.Item label="Absent" value="absent" />
                                        <Picker.Item label="Closed" value="closed" />
                                    </Picker>
                                        <Text style={globalStyles.errormsg}>{props.touched.childStatus && props.errors.childStatus}</Text>
                                    
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


                                    <Text style={globalStyles.text}>Approved By:</Text>
                                    <Picker
                                        selectedValue={props.values.approvedBy}
                                        style={globalStyles.dropDown}
                                        //                                style={{height: 50, width: 100}}
                                        onValueChange={props.handleChange('approvedBy')}

                                        value={props.values.approvedBy}>
                                        <Picker.Item label="Select Staff " value="" />
                                        <Picker.Item label="Ratna" value="Ratna" />
                                        <Picker.Item label="Babu" value="Babu" />
                                        <Picker.Item label="Swapna" value="Swapna" />
                                        <Picker.Item label="Raju" value="Raju" />
                                    </Picker>
                                    <Text style={globalStyles.errormsg}>{props.touched.approvedBy && props.errors.approvedBy}</Text>

                                    {this.state.showElements ?
                                        <View>
                                            <Text style={globalStyles.text}>Leaving Reason:</Text>
                                            <Picker
                                                selectedValue={props.values.leavingReason}
                                                style={globalStyles.dropDown}

                                                onValueChange={(leavingReason) => { this.setState({ leavingReasonError: false}); props.setFieldValue('leavingReason', leavingReason) }}
                                                value={props.values.leavingReason}>
                                                <Picker.Item label="Select Reason " value="" />
                                                <Picker.Item label="Future Program" value="Future Program" />
                                                <Picker.Item label="Parents are able to take care of child" value="Parents are able to take care of child" />
                                                <Picker.Item label="Family bonds strengthen and became responsible" value="Family bonds strengthen and became responsible" />
                                                <Picker.Item label="Child is doing higher studies" value="Child is doing higher studies" />

                                            </Picker>
                                            { this.state.leavingReasonError ? < Text style={globalStyles.errormsg}> Leaving Reason cannot be empty</Text> : null}

                                            <Text style={globalStyles.text}>Reason Description:</Text>
                                           
                                            <TextInput
                                                
                                                style={globalStyles.input}
                                                onChangeText={(reasonDescription) => { this.setState({ reasonDescriptionError: false }); props.setFieldValue('reasonDescription', reasonDescription) }}
                                                //   defaultValue={this.state.text}
                                                multiline={true}
                                                numberOfLines={6}
                                                placeholder={'Enter Reason Description'}
                                                
                                            />
                                            {this.state.reasonDescriptionError ? < Text style={globalStyles.errormsg}>Reason Description is required</Text> : null}
                                            <Text style={globalStyles.text}>Child Left Place:</Text>
                                            <Picker
                                                selectedValue={props.values.leftPlace}
                                                style={globalStyles.dropDown}
                                                //                                style={{height: 50, width: 100}}
                                                onValueChange={(leftPlace) => { this.setState({ leftPlaceError: false }); props.setFieldValue('leftPlace', leftPlace) }}
                                                value={props.values.leftPlace}>
                                                <Picker.Item label="Select Left Place " value="" />
                                                <Picker.Item label="School" value="School" />
                                                <Picker.Item label="Park" value="Park" />
                                                <Picker.Item label="Market" value="Market" />
                                                <Picker.Item label="RH/SG" value="RH/SG" />
                                            </Picker>
                                            {this.state.leftPlaceError ? < Text style={globalStyles.errormsg}>Left Place cannot be empty</Text> : null }

                                            <Text style={globalStyles.text}>Action Taken:</Text>
                                            <Picker
                                                selectedValue={props.values.actionTaken}
                                                style={globalStyles.dropDown}
                                                //                                style={{height: 50, width: 100}}
                                                onValueChange={(actionTaken) => { this.setState({ actionTakenError: false }); props.setFieldValue('actionTaken', actionTaken) }}
                                                value={props.values.actionTaken}>
                                                <Picker.Item label="Select Action Taken " value="" />
                                                <Picker.Item label="Complained To Police" value="Complained To Police" />
                                                <Picker.Item label="Informed to Peers" value="Informed to Peers" />
                                                <Picker.Item label="Informed to CWC in Written" value="Informed to CWC in Written" />
                                                <Picker.Item label="Informed to Parents or Guardians" value="Informed to Parents or Guardians" />
                                            </Picker>
                                            {this.state.actionTakenError ? < Text style={globalStyles.errormsg}>Action Taken is required</Text> : null}

                                            <Text style={globalStyles.text}>Place of Stay After Leaving RH:</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                onChangeText={(stay) => { this.setState({ stayError: false }); props.setFieldValue('stay', stay) }}
                                                value={props.values.stay} //value updated in 'values' is reflected here
                                            />
                                            {this.state.stayError ? < Text style={globalStyles.errormsg}>Stay is required</Text> : null}
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
                                            {this.state.followUpByError ? < Text style={globalStyles.errormsg}>FollowUpBy is required:</Text> : null}

                                            <Text style={globalStyles.text}>Create User Credentials: </Text>
                                            <RadioForm
                                                style={{marginLeft: 10}}
                                                radio_props={radio_props}
                                                initial={-1}
                                                buttonSize={10}
                                                buttonOuterSize={20}
                                                buttonColor={'black'}
                                                buttonInnerColor={'black'}
                                                selectedButtonColor={'black'}
                                                onPress={(value) => { props.setFieldValue('credentials',value) }}
                                            />
                                         
                                        </View>
                                        : null}
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
