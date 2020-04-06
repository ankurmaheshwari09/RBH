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
import { ActivityIndicator } from 'react-native';
import {base_url,getDataAsync} from '../constants/Base';
const CommitteeFormSchema = yup.object({
    Suggestion: yup.string().required(),
    StartingDate: yup.string().required(),
})

export default class CommitteeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showElements: false,
            showSSElements: false,
            updateDetails: false,
            submitAlertMessage: '',
            staffMembers: [],
            selectedStaff: [],
            committeeSuggestionNo: '',
            child: this.props.navigation.getParam('child'),
        }
        this.getStaffMembers =this.getStaffMembers.bind(this);
        this.populateSelectedStaff = this.populateSelectedStaff.bind(this);
        this._submitCommitteeSuggestionForm = this._submitCommitteeSuggestionForm.bind(this);
        this._updateCommitteeSuggestionForm = this._updateCommitteeSuggestionForm.bind(this);
        this._pickDate = this._pickDate.bind(this);
        this.showSDDatepicker = this.showSDDatepicker.bind(this);


    }
    state = {
        showSD: false,
        startingdate: '',
    };

    
    _pickDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            startingdate: a, showSD: false
        });
        handleChange(a);
    }


    showSDDatepicker = () => {
        this.setState({ showSD: true });
    };

    getStaffMembers = () => {
         this.state.staffMembers.map((member) => {
            if(this.state.selectedStaff.includes(member.staffNo)){    
                    member.isSelected = true;
            }
            else{
                    member.isSelected = false;     
            }
            return member;
            });      
            
    };

    populateSelectedStaff = (committeeSuggestion) => {
        var joined = this.state.selectedStaff.concat(committeeSuggestion[0].staffNo);
       this.setState({selectedStaff: joined});
    } 


    componentDidMount() {
        console.log(this.state.child.childNo);
        Promise.all([
        fetch(base_url+"/admission-all-committee-suggestions/"+this.state.child.childNo,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }), 
        fetch(base_url+"/home-staff-list/59",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
    ])
        .then(([response1, response2])=>{return Promise.all([response1.json(), response2.json()]) })
        .then(([responseJson1, responseJson2])=>{
            console.log(responseJson1,'it is response for getting stored details');
            console.log(responseJson2,'it is response for staff list');
            this.setState({staffMembers: responseJson2})
            //this.setState({staffMembers: [...this.state.staffMembers, this.getStaffMembers()]})
            console.log(this.getStaffMembers(),'returning members');
            console.log(this.state.staffMembers,'staff members list');
            if(responseJson1 == null)
            {
                this.state.updateDetails=false;
            }
            else{
                this.state.updateDetails=true;
                this.setState({ committeeSuggestionNo:responseJson1[0].committeeSuggestionNo});
                this.populateSelectedStaff(responseJson2);
             }
    });
    }

    _submitCommitteeSuggestionForm(values) {
        let request_body = JSON.stringify({
                "committeeSuggestionText": values.Suggestion,
                "committeeSuggestionDate": values.StartingDate,
                "childNo": this.state.child.childNo,
                "staffNo": 889
        });
        let result = {};
        fetch(base_url+"/admission-committee-suggestion", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully added suggestions given by committee for '+responseJson.childNo});
            alert(this.state.submitAlertMessage);
            this.setState({ showElements: false, showSSElements: false});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add Details. Plesae contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
            this.setState({showElements: false, showSSElements: false});
        });
    }

    _updateCommitteeSuggestionForm(values) {
        let request_body = JSON.stringify({
                "committeeSuggestionNo": this.state.committeeSuggestionNo,
                "committeeSuggestionText": values.Suggestion,
                "committeeSuggestionDate": values.StartingDate,
                "childNo": this.state.child.childNo,
                "staffNo": 889
        });
        let result = {};
        fetch(base_url+"/admission-committee-suggestion/"+this.state.committeeSuggestionNo, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully updated suggestions given by committee for '+responseJson.childNo});
            alert(this.state.submitAlertMessage);
            this.setState({ showElements: false, showSSElements: false});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to update Details. Plesae contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
            this.setState({date: null, showElements: false, showSSElements: false});
        });
    }


    render() {
        return (<View style={globalStyles.container1}>
            <View style={globalStyles.container}>
                <Formik
                    initialValues={
                        {
                            Suggestion: '',
                            StartingDate: this.state.startingdate,
                            
                        }
                    }
                    validationSchema={CommitteeFormSchema}
                    onSubmit={async (values, actions) => {
                        //actions.resetForm();
                        console.log(values);
                        let checkUpdate =  this.state.updateDetails;
                        if(checkUpdate)
                        {
                            let result = this._updateCommitteeSuggestionForm(values);
                            console.log(result);
                        }
                        else
                        {
                          
                            let result = this._submitCommitteeSuggestionForm(values);
                            console.log(result);
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
                    <Text style={globalStyles.padding}></Text>
                        <Text style={globalStyles.text}>Suggestion:</Text>
                        <Text style={globalStyles.errormsg}>{props.touched.Suggestion && props.errors.Suggestion}</Text>
                        <TextInput
                            style={globalStyles.input}
                            onChangeText={props.handleChange('Suggestion')}
                            value={props.values.Suggestion}
                        />
                        
                        
                        <Text style={globalStyles.text}>Select Date:</Text>
                        <View style={globalStyles.dobView}>
                            <TextInput
                                style={globalStyles.inputText, globalStyles.dobValue}
                                value={this.state.startingdate}
                                editable={true}
                                onValueChange={props.handleChange('StartingDate')}
                            />
                            <TouchableHighlight onPress={this.showSDDatepicker}>
                                <View>
                                    <Feather style={globalStyles.dobBtn} name="calendar" />
                                </View>
                            </TouchableHighlight>
                            {/* <Text style={globalStyles.errormsg}>{props.touched.StartingDate && props.errors.StartingDate}</Text> */}
                            {this.state.showSD &&
                                <DateTimePicker
                                    style={{ width: 100 }}
                                    mode="date" //The enum of date, datetime and time
                                    value={ new Date() }
                                    mode= { 'date' }
                                    
                                    onChange={(e,date) => this._pickDate(e,date,props.handleChange('StartingDate'))}
                                />
                            }
                        </View>
                         

             {
              this.state.staffMembers.map((staffMember,index) => {
               return(
                <React.Fragment key={staffMember.staffNo}>
                <CheckBox    style={styles.checkBoxStyle}
                    onClick={()=>{
                    let tempStaffMembers = [...this.state.staffMembers];
                    console.log(tempStaffMembers);
                    console.log(tempStaffMembers[index].isSelected);
                    tempStaffMembers[index].isSelected = !tempStaffMembers[index].isSelected;
                    console.log(tempStaffMembers[index].isSelected);
                    this.setState({
                    staffMembers: tempStaffMembers
                    });
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
     }
     })