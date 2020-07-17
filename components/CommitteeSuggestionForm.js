import React from 'react';
import {
    Button, Text, TextInput, View, ScrollView,
    KeyboardAvoidingView, StyleSheet, Dimensions, Image, TouchableOpacity
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/global';
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
import { getOrgId } from '../constants/LoginConstant';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
import { Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';
const CommitteeFormSchema = yup.object({
    Suggestion: yup.string().required(),
    MeetingDate: yup.string().required(),
})

export default class CommitteeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showElements: false,
            showSSElements: false,
            updateDetails: false,
            submitAlertMessage: '',
            suggestion: '',
            staffMembers: [],
            selectedStaff: [],
            selectedStaffArray: [],
            updateSelectedStaff: [],
            committeeSuggestionNo: '',
            child: this.props.navigation.getParam('child'),
            sucessDisplay: false,
            errorDisplay: false,
            loading: false,
            isVisible: false,
            staffError: false
        }
        this.getStaffMembers =this.getStaffMembers.bind(this);
        this.populateSelectedStaff = this.populateSelectedStaff.bind(this);
        this._submitCommitteeSuggestionForm = this._submitCommitteeSuggestionForm.bind(this);
        this._updateCommitteeSuggestionForm = this._updateCommitteeSuggestionForm.bind(this);
        this._pickDate = this._pickDate.bind(this);
        this.showSDDatepicker = this.showSDDatepicker.bind(this);
        this.selectedStaffAsObjects = this.selectedStaffAsObjects.bind(this);

    }
    state = {
        showSD: false,
        meetingdate: '',
    };
    
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

    populateSelectedStaff = () => {
    //    let submitted = [];
    //    for(var i=0; i< committeeStaff.length;i++){
    //     submitted = submitted.concat(committeeStaff[i].staffNo);
    //    }
    //    this.setState({staffMembers: submitted});
    let selectedStaffNumber = [];
    this.state.updateSelectedStaff.map((newStaff)=>{
        selectedStaffNumber.push(newStaff.staffNo);
    })
    this.setState({updateSelectedStaff: selectedStaffNumber, selectedStaff: selectedStaffNumber});

     let result = this.state.staffMembers.map((member) => {
         console.log(member.staffNo,'staff')
         console.log(this.state.updateSelectedStaff,'from db staff');
        if(this.state.updateSelectedStaff.includes(member.staffNo)){    
                member.isSelected = true;
                // console.log('true');
        }
        else{
                member.isSelected = false;     
                // console.log('false');
        }
        return member;
        });  
        this.setState({staffMembers: result});
        
    } 

    navigateToChildListScreen() {
        this.setState({ isVisible: false }, () => {
            if (this.state.successDisplay) {
              //  this.props.navigation.navigate('ViewChild');
              
            }
        })
       
    }


    async componentDidMount() {
        console.log(this.state.child.childNo);
        let orgId = getOrgId();
        Promise.all([
        await fetch(base_url+"/admission-all-committee-suggestions/"+this.state.child.childNo,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            }
        }), 
        await fetch(base_url+"/home-staff-list/"+orgId,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
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
                console.log(responseJson1[0],'responseeeeeeeee');
                let formatted_date = moment(responseJson1[0].committeeSuggestionDate).format("YYYY-MM-DD");
                console.log(formatted_date,'date');
                console.log(responseJson1[0].committeeSuggestionText,'suggestionnn' );
                this.setState({committeeSuggestionNo:responseJson1[0].committeeSuggestionNo,
                    suggestion: responseJson1[0].committeeSuggestionText,
                    meetingdate: formatted_date,
                    updateSelectedStaff: responseJson1[0].staffNumber});
                   
                console.log(this.state.suggestion,'state suggestion');  
                console.log(this.populateSelectedStaff(),'populate');
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
        let response = await fetch(base_url+"/admission-committee-suggestion", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: request_body,
        });
        let responseJson = await response.json();
        
        this.setState({ loading: false, isVisible: true,
            suggestion: values.Suggestion,
            meetingdate: values.MeetingDate });
        if(response.ok){
            console.log(responseJson);
            this.setState({ successDisplay: true });
        }
        else{
            console.log(error);
            this.setState({ errorDisplay: true });
        }
          
    }

    async _updateCommitteeSuggestionForm(values) {
       // console.log(this.selectedStaffAsObjects(this.state.selectedStaff),'array turned objects');
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "childNo": this.state.child.childNo,
                "committeeSuggestionDate": values.MeetingDate, 
                "committeeSuggestionNo": this.state.committeeSuggestionNo,
                "committeeSuggestionText": values.Suggestion,
                "staffNo": 1,
                "staffNumber": this.selectedStaffAsObjects(this.state.selectedStaff)
        });
        console.log(request_body,'req body');
        let result = {};
        let response = await fetch(base_url+"/admission-committee-suggestion/"+this.state.committeeSuggestionNo, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: request_body,
        });
        let responseJson = await response.json();
            this.setState({ loading: false, isVisible: true,
                suggestion: values.Suggestion,
                meetingdate: values.MeetingDate});
            if(response.ok) {
                console.log(responseJson);
                this.setState({ successDisplay: true });
            }
            else{
                console.log(error);
                this.setState({ errorDisplay: true });
            }
    }


    render() {
        console.log('calling render',this.state.suggestion);
        return (     
            <View style={globalStyles.container}>

                        {/*Background Image*/}
                       <View style={globalStyles.backgroundlogoimageview}>
                            <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
                        </View>
                <Formik     
                   enableReinitialize
                    initialValues={
                        {
                            Suggestion: this.state.suggestion,
                            MeetingDate: this.state.meetingdate,                      
                        }
                    }
                    validationSchema={CommitteeFormSchema}
                    onSubmit={async (values, actions) => {
                        //actions.resetForm();
                        console.log(values);
                        //this.setState({meetingdate: '', suggestion: ''});
                        let checkUpdate =  this.state.updateDetails;
                        let staffCheck = this.state.selectedStaff;
                        if(JSON.stringify(staffCheck) =='[]'){
                            this.setState({staffError : true});
                        }
                        if(!(this.state.staffError)){
                                if(checkUpdate)
                                {
                                    this._updateCommitteeSuggestionForm(values);
                                    //console.log(result);
                                }
                                else
                                {
                                
                                    let result = this._submitCommitteeSuggestionForm(values);
                                    console.log(result);
                                }
                                this.setState({staffError : false});
                       }
                        //this.props.navigation.push('CommitteeSuggestionForm', values)
                    }}
                >
        {props => (
            <KeyboardAvoidingView behavior="padding"
                enabled style={globalStyles.keyboardavoid}
                keyboardVerticalOffset={200}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View>
                        <Text style={globalStyles.label}>Child Name : </Text>
                        <TextInput
                            style={globalStyles.disabledBox}
                            value={this.state.child.firstName} //value updated in 'values' is reflected here
                            editable={false}
                            selectTextOnFocus={false}
                        />
                        <Text style={globalStyles.padding}></Text>                   
                        <Text style={globalStyles.label}>Select Meeting Date <Text style={{color:"red"}}>*</Text> :</Text>
                        <View style={globalStyles.dobView}>
                            <TextInput
                                style={globalStyles.inputText, globalStyles.dobValue}
                                value={props.values.MeetingDate}
                                onValueChange={props.handleChange('MeetingDate')}                                    
                            />
                            <TouchableHighlight onPress={this.showSDDatepicker}>
                                <View>
                                    <Feather style={globalStyles.dobBtn} name="calendar" />
                                </View>
                            </TouchableHighlight>
            
                            {this.state.showSD &&
                                <DateTimePicker
                                    style={{ width: 200 }}
                                    mode="date" //The enum of date, datetime and time
                                    value={ new Date() }
                                    mode= { 'date' }
                                    onChange={(e,date) => this._pickDate(e,date,props.handleChange('MeetingDate'))}
                                    maximumDate= { new Date() }
                                />
                            }
                            </View>
                            <Text style={globalStyles.errormsg}>{props.touched.MeetingDate && props.errors.MeetingDate}</Text>

                            <Text style={globalStyles.padding}></Text> 
                        <Text style={globalStyles.label}>Committee Suggestion <Text style={{color:"red"}}>*</Text> :</Text>
                        
                        <TextInput
                            style={globalStyles.inputText}
                            onChangeText={props.handleChange('Suggestion')}
                            //onChangeText={(Suggestion)=> { props.setFieldValue('Suggestion', Suggestion) }}
                            value={props.values.Suggestion}
                            multiline={true}
                            numberOfLines={6}
                        /> 
                     <Text style={globalStyles.errormsg}>{props.touched.Suggestion && props.errors.Suggestion}</Text>
                     {/* <Text style={globalStyles.padding}></Text>  */}
                      <Text style={globalStyles.label}>Select Staff <Text style={{color:"red"}}>*</Text> :</Text>                   
             {
              this.state.staffMembers.map((staffMember,index) => {
               return(
                <React.Fragment key={staffMember.staffNo}>
                <CheckBox  style={styles.checkBoxStyle}
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
                    this.setState({ staffError: false});
                    }}
                    isChecked={staffMember.isSelected}     
                    rightText={staffMember.firstName + " " + staffMember.lastName}  
                />     
               </React.Fragment>
               );
             })
            }
            <View>
                {this.state.staffError ? <Text style={globalStyles.errormsg}>Staff is a required field</Text> : null}
            </View>
            
             <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

             </View>
             </ScrollView>
        </KeyboardAvoidingView>

                    )}

                </Formik>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible}>

                    <View style={globalStyles.feedbackContainer}>
                        <TouchableOpacity style={globalStyles.closeModalIcon} onPress={() => { this.navigateToChildListScreen() }}>
                            <View>
                                <Ionicons name="md-close" size={22}></Ionicons>
                            </View>
                        </TouchableOpacity>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='committee details' childNo={this.state.child.firstName} close={true} />
                       
                    </View>
                </Modal>
                <LoadingDisplay loading={this.state.loading} />
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
    FontStyle: {
        fontSize: 15
    }
});

