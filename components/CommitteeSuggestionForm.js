import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView, Field, StyleSheet
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/samplestyles';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
//import { ActivityIndicator } from 'react-native';
import {base_url,getDataAsync} from '../constants/Base';
//import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const CommitteeFormSchema = yup.object({
    Suggestion: yup.string().required(),
    MeetingDate: yup.string().required(),
})

export default class CommitteeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showElements: false,
            showSSElements: false,
            updateDetails: false,
            submitAlertMessage: '',
            suggestion: '',
            staffMembers: [],
            selectedStaff: [],
            selectedStaffArray: [],
            meetingdate: '',
            committeeSuggestionNo: '',
            child: this.props.navigation.getParam('child'),
            sucessDisplay: false,
            errorDisplay: false,
            loading: false,
            isVisible: false,
            showSD: false,
        }
        this.getStaffMembers =this.getStaffMembers.bind(this);
        this.populateSelectedStaff = this.populateSelectedStaff.bind(this);
        this._submitCommitteeSuggestionForm = this._submitCommitteeSuggestionForm.bind(this);
        this._updateCommitteeSuggestionForm = this._updateCommitteeSuggestionForm.bind(this);
        this._pickDate = this._pickDate.bind(this);
        this.showSDDatepicker = this.showSDDatepicker.bind(this);
        this.selectedStaffAsObjects = this.selectedStaffAsObjects.bind(this);

    }
    
    _pickDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            meetingdate: a, showSD: false
        });
        handleChange(a);
    }


    showSDDatepicker = () => {
        this.setState({ showSD: true });
    };
    
   
    selectedStaffAsObjects = (staffArray)=>{
        let tmp = [];
        for(var i=0; i<staffArray.length;i++){
            tmp.push({"staffNo":staffArray[i]});
        }
        return tmp;
    }

    getStaffMembers = () => {
         return this.state.staffMembers.map((member) => {
            if(this.state.selectedStaff.includes(member.staffNo)){    
                    member.isSelected = true;
            }
            else{
                    member.isSelected = false;     
            }
            return member;
            });      
            
    };

    populateSelectedStaff = (committeeStaff) => {
       var joined = this.state.selectedStaff.concat(committeeStaff[0].staffNo);
       this.setState({selectedStaff: joined});
    } 


    async componentDidMount() {
        console.log(this.state.child.childNo);
        Promise.all([
        await fetch(base_url+"/admission-all-committee-suggestions/"+this.state.child.childNo,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }), 
        await fetch(base_url+"/home-staff-list/45",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
    ])
        .then(([response1, response2])=>{return Promise.all([response1.json(), response2.json()]) })
        .then(([responseJson1, responseJson2])=>{
            //console.log(responseJson1,'it is response for getting stored details');
            //console.log(responseJson2,'it is response for staff list');
            this.setState({staffMembers: responseJson2})
            console.log(this.getStaffMembers(),'returning members');
            //console.log(this.state.staffMembers,'staff members list');
            if(responseJson1 == null)
            {
                this.state.updateDetails=false;
                console.log('null response');
            }
            else{
                this.state.updateDetails=true;
                console.log('have response');
                this.setState({committeeSuggestionNo:responseJson1[0].committeeSuggestionNo,
                    suggestion: responseJson1[0].committeeSuggestionText,
                    meetingdate: responseJson1[0].committeeSuggestionDate}
                    );
                let formatted_date = moment(this.state.meetingdate).format("YYYY-MM-DD");
                this.setState({meetingdate: formatted_date});
                //this.populateSelectedStaff(responseJson2);
             }
    });
    }

    async _submitCommitteeSuggestionForm(values) {
        console.log(this.selectedStaffAsObjects(this.state.selectedStaff),'array turned objects');
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "committeeSuggestionText": values.Suggestion,
                "committeeSuggestionDate": values.MeetingDate,
                "childNo": this.state.child.childNo,
                "staffNo": 1,
                "staffNumber": this.selectedStaffAsObjects(this.state.selectedStaff)
        });
        console.log(request_body,'req body');
        let result = {};
        await fetch(base_url+"/admission-committee-suggestion", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ loading: false, isVisible: true });
            // if(responseJson.ok) {
                console.log(responseJson);
                this.setState({ showElements: false, showSSElements: false});
                this.setState({ successDisplay: true });
            //     }
            // else{
            //     throw Error(responseJson.status);
            // }
        })
        .catch((error) => {
            console.log(error);
            this.setState({showElements: false, showSSElements: false});
            this.setState({ errorDisplay: true });
        });
    }

    async _updateCommitteeSuggestionForm(values) {
       // console.log(this.selectedStaffAsObjects(this.state.selectedStaff),'array turned objects');
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "committeeSuggestionNo": this.state.committeeSuggestionNo,
                "committeeSuggestionText": values.Suggestion,
                "committeeSuggestionDate": values.MeetingDate,
                "childNo": this.state.child.childNo,
                "staffNo": 1,
                "staffNumber": this.selectedStaffAsObjects(this.state.selectedStaff)
        });
        console.log(request_body,'req body');
        let result = {};
        await fetch(base_url+"/admission-committee-suggestion/"+this.state.committeeSuggestionNo, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ loading: false, isVisible: true });
            // if(responseJson.ok) {
                console.log(responseJson);
                this.setState({ successDisplay: true });
            // }
            // else{
            //     throw Error(responseJson.status);
            // }
        })
        .catch((error) => {
            console.log(error);
            //this.setState({date: null, showElements: false, showSSElements: false});
            this.setState({ errorDisplay: true });
        });
    }


    render() {
        return (<View style={globalStyles.container1}>
            <View style={globalStyles.container}>
                <Formik
                    initialValues={
                        {
                            Suggestion:'',
                            MeetingDate: this.state.meetingdate,
                            
                        }
                    }
                    validationSchema={CommitteeFormSchema}
                    onSubmit={async(values, actions) => {
                        actions.resetForm();
                        console.log(values);
                        this.setState({meetingdate: ''});
                        let checkUpdate =  this.state.updateDetails;
                        if(checkUpdate)
                        {
                            this._updateCommitteeSuggestionForm(values);
                            //console.log(result);
                        }
                        else
                        {
                          
                            this._submitCommitteeSuggestionForm(values);
                            //console.log(result);
                        }

                        this.props.navigation.push('CommitteeSuggestionForm', values)
                    }}
                >
        {props => (
            <KeyboardAvoidingView behavior="padding"
                enabled style={globalStyles.keyboardavoid}
                keyboardVerticalOffset={200}>
                <ScrollView>

                    <View>
                        <Text style={globalStyles.text}>Child Name : {this.state.child.firstName}</Text>
                                             
                        <Text style={globalStyles.text}>Select Date:</Text>
                        <View style={globalStyles.dobView}>
                            <TextInput
                                style={globalStyles.inputform, globalStyles.dobValue}
                                editable={true}
                                value={this.state.meetingdate}
                                onValueChange={props.handleChange('MeetingDate')}                               
                            />
                            <TouchableHighlight onPress={this.showSDDatepicker}>
                                <View>
                                    <Feather style={globalStyles.dobBtn} name="calendar" />
                                </View>
                            </TouchableHighlight>
            
                            {this.state.showSD &&
                                <DateTimePicker
                                    style={{ width: 100 }}
                                    mode="date" //The enum of date, datetime and time
                                    value={ new Date() }
                                    mode= { 'date' }
                                    onChange={(e,date) => this._pickDate(e,date,props.handleChange('MeetingDate'))}
                                />
                            }
                            {/* <Text style={globalStyles.errormsg}>{props.touched.MeetingDate && props.errors.MeetingDate}</Text> */}
                            </View>

                        <Text style={globalStyles.text}>Enter/Update Suggestion:</Text>
                        {/* <Text style={globalStyles.errormsg}>{props.touched.Suggestion && props.errors.Suggestion}</Text> */}
                        <TextInput
                            style={globalStyles.input}
                            onChangeText={props.handleChange('Suggestion')}
                            value={props.values.Suggestion}
                            multiline={true}
                            numberOfLines={6}
                        /> 
                      <Text style={globalStyles.padding}></Text>                       
             {
              this.state.staffMembers.map((staffMember,index) => {
               return(
                <React.Fragment key={staffMember.staffNo}>
                <CheckBox    style={styles.checkBoxStyle}
                    onClick={()=>{
                    let tempStaffMembers = [...this.state.staffMembers];
                    //console.log(tempStaffMembers);
                    console.log(tempStaffMembers[index].isSelected,'before');
                    tempStaffMembers[index].isSelected = !tempStaffMembers[index].isSelected;
                    console.log(tempStaffMembers[index].isSelected,'after');
                    this.setState({
                    staffMembers: tempStaffMembers
                    });
                    //console.log(this.state.staffMembers,'after selected');
                    let temp = this.state.selectedStaff;
                    if(this.state.staffMembers[index].isSelected==true){
                        console.log('okkk');
                        temp.push(staffMember.staffNo)
                        this.setState({selectedStaff: temp});
                    }
                    else{
                        console.log('nooo');
                        temp.splice(temp.indexOf(staffMember.staffNo),1)
                        this.setState({selectedStaff: temp});
                    }
                    console.log(this.state.selectedStaff,'selected staff');
                   
                    }}
                    isChecked={staffMember.isSelected}     
                    rightText={staffMember.firstName + " " + staffMember.lastName}  
                />     
               </React.Fragment>
               );
             })
            }

             <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

             </View>
             </ScrollView>
        </KeyboardAvoidingView>

                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='suggestions given by committee' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
            </View >
        </View >
        );
    }
}

const styles = StyleSheet.create({
    checkBoxStyle:{
        flex: 1, 
        flexDirection: 'column',
        paddingLeft: 20,
        marginLeft: 10,
        paddingBottom: 25
     },
     checkBoxText:{
        marginTop: 2,
        marginLeft: 30,
        paddingRight:240
     },
    dobView: {
            flex: 1,
            flexDirection: 'row',
        },
    dobValue: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
        marginLeft: 10,
        marginRight: 15
    },
    dobBtn: {
        marginLeft: 2,
        flex: 2,
        fontSize: 40,
        marginRight: 15
    },
});