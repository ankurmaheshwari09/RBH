import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import React from 'react';
import { Button, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, View, Dimensions  } from 'react-native';
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
            "staffNo": values.followUpBy,
            "followupDate": values.date,
            "comments": values.comments
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

    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        params.refreshChildList();

    }


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
                        this.updateFollowUp(values);
                            actions.resetForm();
                            this.setState({ date: null , text: ''});
                         //   alert("Data submitted Successfully");                       
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
                                       
                                        {global.staff.map((item) => {
                                            return <Picker.Item key={item.staffNo} label={item.firstName} value={item.staffNo} />
                                        })}
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
                <Modal style={styles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={styles.MainContainer}>
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
    MainContainer: {
        justifyContent: 'space-between',
        flex: 1,
        //    paddingTop: 10,

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
