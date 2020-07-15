import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import React from 'react';
import { Button, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, View, Dimensions, Image, TouchableOpacity  } from 'react-native';
import * as yup from "yup";
import { globalStyles } from "../styles/global";
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import UpdateApi from "../constants/UpdateApi";
import { Ionicons } from '@expo/vector-icons';

const followUpSchema = yup.object({
    FollowUpBy: yup.string().required(),
    Date: yup.string().required(),
    Comments: yup.string().required(),
});

export default class FollowUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,     
            show: false,
            text: 'hi',
            child: this.props.navigation.getParam('child'),
            isVisible: false,
            loading: false,
            errorDisplay: false,
            sucessDisplay: false
        }
        this.pickDob = this.pickDob.bind(this);
     //   this.updateFollowUp = this.updateFollowUp(this);
        
    }

    updateFollowUp(values) {
        let request_body = JSON.stringify({
            "childNo": this.state.child.childNo,
            "staffNo": values.FollowUpBy,
            "followupDate": values.Date,
            "comments": values.Comments
        });
        this.setState({ loading: true });
        console.log(request_body);
        const path = `child-followup`;
        UpdateApi.addData(request_body, path).then((response) => {
            this.setState({ loading: false, isVisible: true, });
            if (response.ok) {
                response.json().then((res) => {
                    console.log(res);
                });
                this.setState({ successDisplay: true });
                // alert("Data submitted Successfully");
            } else {
                throw Error(response.status);
            }
        }).catch(error => {
            console.log(error, 'ffff');
          //  this.setState({ successDisplay: true });
               this.setState({ errorDisplay: true });
            //  alert("Error submitting data");
        });

    }

    pickDob = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (new Date(a)));
        this.setState({ date: a, show: false });
        handleChange(a);
    }

    showDatepicker = () => {
        this.setState({ show: true });

    };

    navigateToChildListScreen() {
        this.setState({ isVisible: false }, () => {
            if (this.state.successDisplay) {
             //   this.props.navigation.navigate('ViewChild');
            }
        })

    }

   
    render() {

        return (
            <View style={globalStyles.scrollContainer}>

               
                <Formik
                    initialValues={{
                        FollowUpBy: '',
                        Date: '',
                        Comments: ''
                    }}
                    validationSchema={followUpSchema}
                    onSubmit={(values, actions) => {                                          
                        console.log(values);
                        this.updateFollowUp(values);
                            actions.resetForm();
                            this.setState({ date: null , text: ''});
                         //   alert("Data submitted Successfully");                       
                    }}

                >
                    {(props) => (
                        <KeyboardAvoidingView behavior="null"
                            enabled style={globalStyles.keyboardavoid}
                            keyboardVerticalOffset={0}>

                            <ScrollView>
                                <View>
                                    {/*FollowUp By*/}
                                    <Text style={globalStyles.label}>FollowUp By <Text style={{ color: "red" }}>*</Text>:</Text>
                                    <Picker
                                        selectedValue={props.values.FollowUpBy}
                                        style={globalStyles.dropDown}
                                        //                                style={{height: 50, width: 100}}
                                        onValueChange={(follwUpBy) => { this.setState({ followUpByError: false }); props.setFieldValue('FollowUpBy', follwUpBy) }}
                                        value={props.values.FollowUpBy}>
                                        <Picker.Item label="Select Staff " value="" />
                                       
                                        {global.staff.map((item) => {
                                            return <Picker.Item key={item.staffNo} label={item.firstName} value={item.staffNo} />
                                        })}
                                    </Picker>
                                    <View>
                                        <Text style={globalStyles.errormsg}>{props.touched.FollowUpBy && props.errors.FollowUpBy}</Text>
                                    </View>


                                    {/*Date*/}
                                    <Text style={globalStyles.label}>Date <Text style={{ color: "red" }}>*</Text>:</Text>
                                    <View style={globalStyles.dateView}>
                                        <TextInput
                                            style={globalStyles.inputText, globalStyles.dobValue}
                                            value={this.state.date}
                                            editable={false}
                                            onValueChange={props.handleChange('Date')}
                                        />
                                        <TouchableHighlight onPress={this.showDatepicker}>
                                            <View>
                                                <Feather style={globalStyles.dateBtn} name="calendar" />
                                            </View>
                                        </TouchableHighlight>
                                        {/* <Button style= {addChildStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                         {this.state.show &&
                                            <DateTimePicker
                                                style={{ width: 200 }}
                                                mode="date" //The enum of date, datetime and time
                                                value={new Date()}
                                                mode={'date'}
                                                maximumDate={new Date((new Date()).setDate((new Date()).getDate()))}
                                                onChange={(e, date) => { this.pickDob(e, date, props.handleChange('Date')) }}
                                            />
                                        }
                                    </View>
                                    <Text style={globalStyles.errormsg}>{props.touched.Date && props.errors.Date}</Text>



                                    {/*Comments*/}
                                    <Text style={globalStyles.label}>Comments <Text style={{ color: "red" }}>*</Text>:</Text>

                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={props.handleChange('Comments')}
                                        multiline={true}
                                        numberOfLines={10}
                                        value={props.values.Comments} //value updated in 'values' is reflected here
                                        placeholder={'Enter Comments'}
                                    />
                                    <View>
                                    <Text style={globalStyles.errormsg}>{props.touched.Comments && props.errors.Comments}</Text> 
                                    </View>
                                    
                                    <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    )}
                </Formik>
                <Modal style={styles.modalContainer} isVisible={this.state.isVisible}>
                    <View style={globalStyles.feedbackContainer}>
                        <TouchableOpacity style={globalStyles.closeModalIcon} onPress={() => { this.navigateToChildListScreen() }}>
                            <View>
                                 <Ionicons name="md-close" size={22}></Ionicons>
                            </View>
                        </TouchableOpacity>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Followup Status' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    FontStyle: {
        fontSize: 15
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
        //  margin: 90,

    }
});
