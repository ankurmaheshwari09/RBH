import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import React from 'react';
import {  Button, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';
import * as yup from "yup";
import { globalStyles } from "../styles/global";
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import Select from 'react-select';

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
            child: this.props.navigation.getParam('child'),
            isVisible: false,
            loading: false,
            errorDisplay: false,
            sucessDisplay: false,
            statusOptions: global.status,
            selectedOption: null
        }
        this.pickDob = this.pickDob.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    }

    //setting the dropdown options according to current status
    static getDerivedStateFromProps(props, state) {
        if (state.child.childStatus.childStatusId == 1) {
            
            return {
                statusOptions: global.status.filter((item)  => {
                    return item.childStatusId == 2 || item.childStatusId == 3;
            })
            }
        }  else if (state.child.childStatus.childStatusId == 2) {
            
            return {
                statusOptions: global.status.filter((item) => {
                    return (item.childStatusId == 4) || (item.childStatusId == 3) ;
                })
            }
        } else if (state.child.childStatus.childStatusId == 3) {
            
            return {
                statusOptions: global.status.filter((item) => {
                    return item.childStatusId == 2 || item.childStatusId == 4;
                })
            }
        } else if (state.child.childStatus.childStatusId == 4) {
            //setting the option as readmission when current option is close
            return {
                statusOptions: global.status.filter((item) => {
                    return item.childStatusId == 5;
                })        
            }
        }
        else return state;
    }

    pickDob = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({ date: a, show: false });
        handleChange(a);
    }

    showDatepicker = () => {
        this.setState({ show: true });

    };
d
    updateStatus(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
           
               "childStatusID": values.childStatus,
               "childStatusDate": values.date,
               "leavingReasonId": values.leavingReason,
               "reason": values.reasonDescription,
               "childLeftPlaceId": values.leftPlace,
               "actionTakenId": values.actionTaken,
               "childStayPlace": values.stay,
               "followedBy": values.followUpBy,
               "approvedBy": values.approvedBy
            
        });
        console.log(values);
        const path = `child-status/${this.state.child.childNo}`;
        UpdateApi.updateData(request_body, path).then((response) => {
            this.setState({ loading: false, isVisible: true });
            if (response.ok) {
                response.json().then((res) => {
                    console.log(res);
                });
                this.setState({ successDisplay: true });
              
            } else {
                throw Error(response.status);
            }
        }).catch(error => {
            console.log(error, 'ffff');
            this.setState({ errorDisplay: true });
        
        });
      
    }

   
    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        params.refreshChildList();
        
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
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
        const options = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' },
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
                          //  console.log(values);
                            this.updateStatus(values);
                            actions.resetForm();
                            this.setState({ date: null, showElements: false, leavingReasonError: false, reasonDescriptionError: false, leftPlaceError: false, actionTakenError: false, stayError: false, followUpByError: false, credentialsError: false });
                           
                        }
                    }}

                >
                    {(props) => (
                        <KeyboardAvoidingView behavior="null"
                            enabled style={globalStyles.keyboardavoid}
                            keyboardVerticalOffset={0}>

                            <ScrollView>
                                <View>
                                   
                                    <Text style={globalStyles.text}>Child Status:</Text>
                                    <Picker
                                       
                                        selectedValue={props.values.childStatus}
                                        style={globalStyles.dropDown}
                                        //                                style={{height: 50, width: 100}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('childStatus', itemValue)
                                            if (itemValue == 4) {
                                                this.setState({ showElements: true })
                                            } else {
                                                this.setState({ showElements: false })
                                            }
                                        }}

                                        value={props.values.childStatus}>
                                        <Picker.Item label="Select Status" value="" />
                                        {this.state.statusOptions.map((item) => {
                                            if (item.childStatusId == 4) {
                                                console.log('insdie if');
                                                return <Picker.Item key= '4' label={'Exit'} value='4' />
                                            } else if (item.childStatusId == 5) {
                                                return <Picker.Item key={item.childStatusId} label={'Present'} value={item.childStatusId} />
                                            }
                                            else {
                                                return <Picker.Item key={item.childStatusId} label={item.childStatus} value={item.childStatusId} />
                                            }
                                        
                                        })}

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
                                        onValueChange={(approvedBy) => props.setFieldValue('approvedBy', approvedBy)}

                                        value={props.values.approvedBy}>
                                       
                                        <Picker.Item label="Select Staff " value="" />

                                        {global.staff.map((item) => {
                                            return <Picker.Item key={item.staffNo} label={item.firstName} value={item.staffNo} />
                                        })}
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
                                                {global.leavingReason.map((item) => {
                                                        return <Picker.Item key={item.leavingReasonId} label={item.leavingReason} value={item.leavingReasonId} />
                                                })}

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
                                                {global.leftPlaces.map((item) => {
                                                    return <Picker.Item key={item.leftPlaceId} label={item.leftPlace} value={item.leftPlaceId} />
                                                })}
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
                                                {global.actionTaken.map((item) => {
                                                    return <Picker.Item key={item.actionId} label={item.actionTaken} value={item.actionId} />
                                                })}
                                            </Picker>
                                            <Select
                                                value={this.state.selectedOption}
                                                onChange={this.handleChange}
                                                options={options}
                                            />
                                            
                                            
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

                                                {global.staff.map((item) => {
                                                    return <Picker.Item key={item.staffNo} label={item.firstName} value={item.staffNo} />
                                                })}
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
                <Modal style={styles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={styles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Status' childNo={this.state.child.firstName}/ >
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
        width: Dimensions.get('window').width /2 + 50,
        maxHeight: Dimensions.get('window').height / 4,
        top: 150,
        borderRadius: 30
      //  margin: 90,

    }
});
