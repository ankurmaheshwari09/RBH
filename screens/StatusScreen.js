import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import React from 'react';
import { Button, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, BackHandler, Text, TextInput, View, Dimensions, Image, TouchableOpacity } from 'react-native';
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
import CheckBox from "react-native-check-box";
import { Ionicons } from '@expo/vector-icons';


const statusSchema = yup.object({
    ChildStatus: yup.string().required(),
    Date: yup.string().required(),
    ApprovedBy: yup.string().required(),
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
            status: this.props.navigation.getParam('child').childStatusId,
            isVisible: false,
            isMailModelVisible: false,
            loading: false,
            errorDisplay: false,
            sucessDisplay: false,
            actionsTaken: [],
            actionItemsModal: false,
            statusOptions: global.status,
            selectedOption: null,
            credentials: false,
            emailError: false,
            checkEmail: null,
            checkPhNo: null,
            phNoError: false,
            emailContainerEmpty: false,
            selectedStatus: null,
            actionTakenItems: []
            
        }
        this.pickDob = this.pickDob.bind(this);
        this.handleChange = this.handleChange.bind(this);
       
    }

  
    //setting the dropdown options according to current status
    static getDerivedStateFromProps(props, state) {
       
        if (state.status == 1) {
            
            return {
                statusOptions: global.status.filter((item)  => {
                    return item.childStatusId == 2 || item.childStatusId == 3;
            })
            }
        } else if (state.status == 2) {
            
            return {
                statusOptions: global.status.filter((item) => {
                    return (item.childStatusId == 4) || (item.childStatusId == 3) ;
                })
            }
        } else if (state.status == 3) {
            
            return {
                statusOptions: global.status.filter((item) => {
                    return item.childStatusId == 2 || item.childStatusId == 4;
                })
            }
        } else if (state.status == 4) {
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
        if (date !== null) {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({ date: a, show: false });
            handleChange(a);
        } else {
            this.setState({ date: date, show: false });
        }
    }

    showDatepicker = () => {
        /*if (this.state.selectedStatus !== null && this.state.selectedStatus !== '') {
           

        } else {
            alert("Please select a status ");
        }*/

        this.setState({ show: true });

    };

    updateStatus(values) {
        this.setState({ loading: true });
        console.log(values);
        let request_body = JSON.stringify({
           
               "childStatusID": values.ChildStatus,
               "childStatusDate": values.Date,
               "leavingReasonId": values.leavingReason,
               "reason": values.reasonDescription,
               "childLeftPlaceId": values.leftPlace,
               "actionTakenId": this.state.actionsTaken.sort().join(','),
               "childStayPlace": values.stay,
               "followedBy": values.followUpBy,
               "approvedBy": values.ApprovedBy,
              
        });
        console.log(request_body);
        let path = `child-status/${this.state.child.childNo}`;
        if (this.state.credentials) {
            if (values.email != '' && values.phNo != '') {
                path = path + `?email=${values.email}&phNo=${values.phNo}`;

            } else if (values.email != '') {
                path = path + `?email=${values.email}`;

            } else if (values.phNo != '') {
            path = path + `?phNo=${ values.phNo }`;

            }
            if (values.future) {
                path = path + `&future=${values.future}`;
            }
        }
        console.log(path);
        UpdateApi.updateData(request_body, path).then((response) => {
            this.setState({ loading: false, isVisible: true, errorDisplay: false });
            if (response.ok) {
                response.json().then((res) => {
                    console.log(res);
                   
                });
                this.setState({ successDisplay: true, status: values.ChildStatus }, () => {
                    const { params } = this.props.navigation.state;
                    params.refreshChildList();
                });
            } else {
                throw Error(response.status);
            }
        }).catch(error => {
            console.log(error, 'ffff');
            this.setState({ errorDisplay: true });
        
        });
      
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
    };

    navigateToChildListScreen() {
        this.setState({ isVisible: false }, () => {
            if (this.state.successDisplay) {
                this.props.navigation.navigate('ViewChild');
              
            }
        })
       
    }

    onCreateCredentialsSelected() {
       
        this.setState({ isMailModelVisible: true, credentials: true });
    }

    validateEmailContainer() {
       
        if ((this.state.checkEmail === null || this.state.checkEmail === '') && (this.state.checkPhNo === null || this.state.checkPhNo === '')) {
            console.log("inside empty");
            this.setState({ emailContainerEmpty: true, emailError: false, phNoError: false });

        } else {
            this.setState({ emailContainerEmpty: false });
            if ((this.state.checkEmail !== null) && (this.state.checkPhNo !== null)) {
                console.log("inside first case");
                let error = this.invalidEmail() || this.invalidPhnNo();
                this.setState({ isMailModelVisible: error });

            } else if (this.state.checkEmail !== null) {
                console.log("inside second case");
                let error = this.invalidEmail();
                this.setState({ isMailModelVisible: error, phNoError: false });
            } else if (this.state.checkPhNo !== null) {
                console.log("inside third case");
                let error = this.invalidPhnNo();
                this.setState({ isMailModelVisible: error, emailError: false });
            }
        }
    }

    invalidEmail() {
        console.log("inside email")
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.checkEmail) === false) {
            this.setState({ emailError: true });
            return true;
        } else {
            this.setState({ emailError: false });
            return false;
        }
    }

    invalidPhnNo() {
        console.log("inside phno")
        let reg = /^\d{10}$/;
        console.log(reg.test(this.state.checkPhNo), "ggggg");
        if (reg.test(this.state.checkPhNo) === false) {
            this.setState({ phNoError: true });
            return true;
        } else {
            this.setState({ phNoError: false });
            return false;
        }
    }
    

    onSubmitEmailContainer() {
        this.validateEmailContainer();
    }

    getStylesForDate() {
        console.log(this.state.selectedStatus);
        if (this.state.selectedStatus !== null && this.state.selectedStatus !== '') {
            return globalStyles.inputText, globalStyles.dobValue;
        } else {
            return styles.disabledDobBox;
        }
    }

    render() {
        const radio_props = [
            {
                label: 'Child Exits',
                value: false
            },
            {
                label: 'Child Moves To Future Program',
                value: true
            }
        ];
       
        return (
            <View style={globalStyles.container}>

                {/*Background Image*/}
                <View style={globalStyles.backgroundlogoimageview}>
                    <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
                </View>
               
              
                <Formik
                    initialValues={{
                        ChildStatus: '',
                        Date: '',
                        ApprovedBy: '',
                        leavingReason: '',
                        reasonDescription: '',
                        leftPlace: '',
                        stay: '',
                        followUpBy: '',
                        email: '',
                        phNo: '',
                        future:''
                    }}
                    validationSchema={statusSchema}
                    onSubmit={(values, actions) => {
                        if (values.leavingReason == '' && this.state.showElements == true) {
                            this.setState({ leavingReasonError: true });
                        } if (values.reasonDescription == '' && this.state.showElements == true) {
                            this.setState({ reasonDescriptionError: true });
                        } if (values.leftPlace == '' && this.state.showElements == true) {
                            this.setState({ leftPlaceError: true });
                        } if (JSON.stringify(values.actionsTaken) == '[]' && this.state.showElements == true) {
                            this.setState({ actionTakenError: true });
                        } if (values.stay == '' && this.state.showElements == true) {
                            this.setState({ stayError: true });
                        } if (values.followUpBy == '' && this.state.showElements == true) {
                            this.setState({ followUpByError: true });
                        }
                        if (!(this.state.leavingReasonError || this.state.reasonDescriptionError || this.state.leftPlaceError || this.state.actionTakenError || this.state.stayError || this.state.followUpByError || this.state.emailContainerEmpty || this.state.emailError || this.state.phNoError)) {
                            this.updateStatus(values);
                            actions.resetForm();
                            this.setState({
                                date: null, showElements: false, leavingReasonError: false,
                                reasonDescriptionError: false, leftPlaceError: false,
                                actionTakenError: false, stayError: false, followUpByError: false,
                                credentialsError: false, credentials: false,
                                checkEmail: null, emailError: false, checkPhNo: null, phNoError: false, emailContainerEmpty: false
                            });
                           
                        }
                    }}

                >
                    {(props) => (
                        <KeyboardAvoidingView behavior="null"
                            enabled style={globalStyles.keyboardavoid}
                            keyboardVerticalOffset={0}>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View>
                                    {/*Child Name*/}
                                    <Text style={globalStyles.label}>Child Name: </Text>
                                    <TextInput
                                        style={globalStyles.disabledBox}
                                        value={this.state.child.firstName} //value updated in 'values' is reflected here
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                   
                                    {/*Child Status*/}
                                    <Text style={globalStyles.label}>Child Status <Text style={{ color: "red" }}>*</Text>:</Text>
                                    <Picker
                                        selectedValue={props.values.ChildStatus}
                                        style={globalStyles.dropDown}
                                        //                                style={{height: 50, width: 100}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('ChildStatus', itemValue)
                                            if (itemValue == 4) {
                                                this.setState({ showElements: true, selectedStatus: itemValue })
                                            } else {
                                                this.setState({ showElements: false, selectedStatus: itemValue })
                                            }
                                            this.pickDob(null, null, props.handleChange('Date'));
                                        }}
                                        value={props.values.ChildStatus}>
                                        <Picker.Item label="Select Status" value="" />
                                        {this.state.statusOptions.map((item) => {
                                            if (item.childStatusId == 4) {
                                                return <Picker.Item key={item.childStatusId} label={'Exit'} value={item.childStatusId} />
                                            } else if (item.childStatusId == 5) {
                                                return <Picker.Item key={item.childStatusId} label={'Present'} value={item.childStatusId} />
                                            }
                                            else {
                                                return <Picker.Item key={item.childStatusId} label={item.childStatus} value={item.childStatusId} />
                                            }
                                        
                                        })}
                                    </Picker>
                                        <Text style={globalStyles.errormsg}>{props.touched.ChildStatus && props.errors.ChildStatus}</Text>

                                    {/*Date*/}
                                    <Text style={globalStyles.label}>Date <Text style={{ color: "red" }}>*</Text>:</Text>
                                    <View style={globalStyles.dobView}>
                                        <TextInput
                                            style={globalStyles.dobValue}
                                         
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
                                            maximumDate={new Date((new Date()).setDate((new Date()).getDate()))}
                                            minimumDate={this.state.selectedStatus === 2 || this.state.selectedStatus === 4 ? new Date((new Date()).setDate((new Date()).getDate()-30)) : null}
                                            mode={'date'}
                                            onChange={(e, date) => { this.pickDob(e, date, props.handleChange('Date')) }}
                                            />
                                        }
                                    </View>
                                    <Text style={globalStyles.errormsg}>{props.touched.Date && props.errors.Date}</Text>


                                    {/*Approved By*/}
                                    <Text style={globalStyles.label}>Approved By <Text style={{ color: "red" }}>*</Text>:</Text>
                                    <Picker
                                        selectedValue={props.values.ApprovedBy}
                                        style={globalStyles.dropDown}
                                        onValueChange={(approvedBy) => props.setFieldValue('ApprovedBy', approvedBy)}
                                        value={props.values.ApprovedBy}>
                                       
                                        <Picker.Item label="Select Staff " value="" />

                                        {global.staff.map((item) => {
                                            return <Picker.Item key={item.staffNo} label={item.firstName} value={item.staffNo} />
                                        })}
                                    </Picker>
                                    <Text style={globalStyles.errormsg}>{props.touched.ApprovedBy && props.errors.ApprovedBy}</Text>

                                    {/*Show these elements when child exists*/}
                                    {this.state.showElements ?
                                        <View>
                                            {/*Leaving Reason*/}
                                            <Text style={globalStyles.label}>Leaving Reason <Text style={{ color: "red" }}>*</Text>:</Text>
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
                                            <View>
                                                {this.state.leavingReasonError ? < Text style={globalStyles.errormsg}> Leaving Reason cannot be empty</Text> : null}
                                            </View>

                                            {/*Reason Description*/}
                                            <Text style={globalStyles.label}>Reason Description <Text style={{ color: "red" }}>*</Text>:</Text>
                                           
                                            <TextInput
                                                style={globalStyles.inputText}
                                                onChangeText={(reasonDescription) => { this.setState({ reasonDescriptionError: false }); props.setFieldValue('reasonDescription', reasonDescription) }}
                                                //   defaultValue={this.state.text}
                                                multiline={true}
                                                numberOfLines={8}
                                                placeholder={'Enter Reason Description'}
                                                
                                            />
                                            <View>
                                                {this.state.reasonDescriptionError ? < Text style={globalStyles.errormsg}>Reason Description is required</Text> : null}
                                            </View>


                                            {/*Left Place*/}
                                            <Text style={globalStyles.label}>Child Left Place <Text style={{ color: "red" }}>*</Text>:</Text>
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
                                            <View>
                                                {this.state.leftPlaceError ? < Text style={globalStyles.errormsg}>Left Place cannot be empty</Text> : null}
                                            </View>


                                            {/*Action taken*/}
                                            <Text style={globalStyles.label}>Action Taken <Text style={{ color: "red" }}>*</Text>:</Text>
                                            <TouchableOpacity onPress = {() => {
                                                this.setState({
                                                    actionItemsModal: true
                                                })
                                            }}>
                                                <Text style={globalStyles.touchableBox}>Select Action</Text>
                                            </TouchableOpacity>
                                            <Modal style={styles.actionItemsModal} isVisible={this.state.actionItemsModal} onBackdropPress={() => this.setState({ actionItemsModal: false })}>
                                                <View style = {{ flex: 1,justifyContent:'center'}}>
                                                    {global.actionTaken.map((item) => {
                                                        return <CheckBox 
                                                                    style={{ flex: 1, padding: 10 }}
                                                                    onClick = {() => {
                                                                        let arr = this.state.actionsTaken
                                                                        let arrForDisplay = this.state.actionTakenItems
                                                                        if(arr.indexOf(item.actionId) == -1){
                                                                            arr.push(item.actionId);
                                                                            arrForDisplay.push(item.actionTaken);
                                                                            console.log(arrForDisplay);
                                                                        } else{
                                                                            arr.splice(arr.indexOf(item.actionId), 1)
                                                                            arrForDisplay.splice(arrForDisplay.indexOf(item.actionTaken), 1);
                                                                        }
                                                                        this.setState({ actionsTaken: arr, actionTakenItems: arrForDisplay })
                                                                    }}
                                                                    key = {item.actionId}
                                                                    leftText={item.actionTaken}
                                                                    isChecked = {this.state.actionsTaken.indexOf(item.actionId) !== -1}
                                                                    />
                                                    })}
                                                </View>
                                                <View style={styles.buttonSize}>
                                                    <Button style={globalStyles.modalButton} onPress={() => this.setState({actionItemsModal: false })} title="Submit"></Button>
                                                </View>
                                            </Modal>
                                            <View>
                                                {this.state.actionTakenError ? < Text style={globalStyles.errormsg}>Action Taken is required</Text> : null}
                                            </View>
                                            <View>
                                                <Text style={styles.selecetdOptions}>{this.state.actionTakenItems.toString()}</Text> 
                                            </View>

                                            {/*Place of stay fater leaving RH */}

                                            <Text style={globalStyles.label}>Place of Stay After Leaving RH <Text style={{ color: "red" }}>*</Text>:</Text>
                                            <TextInput
                                                style={globalStyles.inputText}
                                                onChangeText={(stay) => { this.setState({ stayError: false }); props.setFieldValue('stay', stay) }}
                                                value={props.values.stay} //value updated in 'values' is reflected here
                                            />
                                            <View>
                                            {this.state.stayError ? < Text style={globalStyles.errormsg}>Stay is required</Text> : null}
                                            </View>


                                            {/*FollowUp By*/}
                                            <Text style={globalStyles.label}>FollowUp By <Text style={{ color: "red" }}>*</Text>:</Text>
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
                                            <View>
                                                {this.state.followUpByError ? < Text style={globalStyles.errormsg}>FollowUpBy is required</Text> : null}
                                            </View>


                                            {/*User Credentials*/}
                                          
                                                
                                            <Text style={globalStyles.label}>Create User Credentials : (optional) </Text>

                                           
                                            <View>
                                            <RadioForm
                                                style={{marginLeft: 10, marginTop:5}}
                                                radio_props={radio_props}
                                                initial={-1}
                                                buttonSize={10}
                                                buttonOuterSize={20}
                                                buttonColor={'black'}
                                                buttonInnerColor={'black'}
                                                    selectedButtonColor={'black'}
                                                    onPress={(value) => { props.setFieldValue('future', value); this.onCreateCredentialsSelected(); }}
                                                />
                                            </View>
                                            <View>
                                                {this.state.emailContainerEmpty ? < Text style={globalStyles.errormsg}>Enter atleast one Value</Text> : null}
                                            </View>
                                            <View>
                                                {this.state.emailError || this.state.phNoError ? < Text style={globalStyles.errormsg}>Enter correct email or PhNo</Text> : null}
                                            </View>

                                            <Modal style={styles.emailContainer} isVisible={this.state.isMailModelVisible} onBackdropPress={() => { this.setState({ isMailModelVisible: false }) }}>
                                                <View>

                                                    <TouchableOpacity style={styles.closeModalIcon} onPress={() => { this.onSubmitEmailContainer(),this.setState({ isMailModelVisible: false }) }}>
                                                        <View>
                                                            <Ionicons name="md-close-circle-outline" size={22}></Ionicons>
                                                        </View>
                                                    </TouchableOpacity>
                                                     
                                                    <Text style={globalStyles.label}>Enter Child Email: </Text>
                                                    <TextInput
                                                        style={globalStyles.inputText}
                                                        onChangeText={(input) => {
                                                            props.setFieldValue('email', input);
                                                            if (input === '') {
                                                                this.setState({ checkEmail: null })
                                                            } else {
                                                                this.setState({ checkEmail: input })
                                                            }
                                                        }}
                                                        value={props.values.email} //value updated in 'values' is reflected here
                                                    />
                                                    <View>
                                                        {this.state.emailError ? < Text style={globalStyles.errormsg}>Invalid email</Text> : null}
                                                    </View>
                                                    <Text style={globalStyles.label}>Enter Child Phone number: </Text>
                                                    <TextInput
                                                        style={globalStyles.inputText}
                                                        keyboardType="numeric"
                                                        onChangeText={(input) => {
                                                            props.setFieldValue('phNo', input);
                                                            if (input === '') {
                                                                this.setState({ checkPhNo: null })
                                                            } else {
                                                                this.setState({ checkPhNo: input })
                                                            }
                                                        }}
                                                        value={props.values.phNo} //value updated in 'values' is reflected here
                                                    />
                                                    <View>
                                                        {this.state.phNoError ? < Text style={globalStyles.errormsg}>Invalid Phone Number</Text> : null}
                                                    </View>
                                                    <View>
                                                        {this.state.emailContainerEmpty ? < Text style={globalStyles.errormsg}>Enter atleast one Value</Text> : null}
                                                    </View>
                                                    <Button style={globalStyles.modalButton} onPress={() => this.onSubmitEmailContainer()} title="Submit"></Button>

                                                </View>
                                                </Modal>
                                            
                                        </View>
                                        : null}
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
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Status' childNo={this.state.child.firstName} close={true} />
                       
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
    myButton: {
        padding: 5,
        height: 50,
        width: 50,  //The Width must be the same as the height
        borderRadius: 100, //Then Make the Border Radius twice the size of width or Height   
        backgroundColor: 'rgb(195, 125, 198)',

    },
    MainContainer: {
      //  justifyContent: 'space-between',
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
    },
    emailContainer: {
        alignItems: 'center',
        backgroundColor: '#F2EEEE',
        width: Dimensions.get('window').width / 2 + 50,
        maxHeight: Dimensions.get('window').height / 3,
        marginTop: Dimensions.get('window').height / 3,
        marginLeft: Dimensions.get('window').width / 5,
        borderRadius: 30
        //  margin: 90,
    },
    actionItemsModal:{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F2EEEE',
        // width: Dimensions.get('window').width /2 + 50,
        maxHeight: Dimensions.get('window').height / 2,
        marginTop: 150,
        //top: 150,
        borderColor: 'black',
        borderRadius: 30
    },
    buttonSize: {
        maxWidth: Dimensions.get('window').width / 4,
        marginLeft: Dimensions.get('window').width / 4 + 30,
        justifyContent: 'center',
    },
    selecetdOptions: {
        color: 'green'
    },
    closeModalIcon: {
        left: Dimensions.get('window').width / 2.5,
        top: Dimensions.get('window').height / 200 ,
    },
    disabledDobBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
        borderColor: 'black',
        backgroundColor: '#fafafa'
    }
    
});
