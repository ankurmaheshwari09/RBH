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
import CheckBox from 'react-native-check-box'
const CommitteeFormSchema = yup.object({
    Suggestion: yup.string().required(),
    // Date: yup.string().required(),
})

export default class CommitteeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            showElements: false,
            showSSElements: false
        }
    }
    state = {
        showSD: false,
        startingdate: '',
    };
    
    _pickDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('DD/MM/YYYY');
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

    handleDobChange = () => {
        console.log("change called");
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
                    onSubmit={(values, actions) => {
                        actions.resetForm();
                        console.log(values);
                        this.setState({
                            date: null, showElements: false, showSSElements: false
                        });
                        alert("Data Has been submitted")
                        this.props.navigation.push('CommitteeSuggestionForm', values)

                    }}
                >
        {props => (
            <KeyboardAvoidingView behavior="padding"
                enabled style={globalStyles.keyboardavoid}
                keyboardVerticalOffset={200}>
                <ScrollView>

                    <View>
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
                            <Text style={globalStyles.errormsg}>{props.touched.StartingDate && props.errors.StartingDate}</Text>
                            {this.state.showSD &&
                                <DateTimePicker
                                    style={{ width: 100 }}
                                    mode="date" //The enum of date, datetime and time
                                    value={new Date()}
                                    mode={'date'}
                                    onChange={(e, date) => this._pickDate(e, date, props.handleChange('StartingDate'))}
                                />
                            }
                        </View>
                         
             <CheckBox    style={styles.checkBoxStyle}
               onClick={()=>{
                  this.setState({
                     isMember1: !this.state.isMember1
                  })
                  }}
                  isChecked={this.state.isMember1}     
                  rightText='Staff Member 1'               
            />           

           
             <CheckBox  style={styles.checkBoxStyle}
                onClick={()=>{
                this.setState({
                  isMember2:!this.state.isMember2
                })
                }}
                isChecked={this.state.isMember2}    
                rightText='Staff Member 2'      
            />
            
             <CheckBox   style={styles.checkBoxStyle}

                onClick={()=>{
                this.setState({
                  isMember3:!this.state.isMember3
                })
                }}
                isChecked={this.state.isMember3}     
                rightText='Staff Member 3'    
            />
            
             <CheckBox    style={styles.checkBoxStyle}
 
                onClick={()=>{
                this.setState({
                  isMember4:!this.state.isMember4
                })
                }}
                isChecked={this.state.isMember4} 
                rightText='Staff Member 4'        
            />
           
             <CheckBox    style={styles.checkBoxStyle}

                onClick={()=>{
                this.setState({
                  isMember5:!this.state.isMember5
                })
                }}
                isChecked={this.state.isMember5}   
                rightText='Staff Member 5'          
            />
           
             <CheckBox    style={styles.checkBoxStyle}

                onClick={()=>{
                this.setState({
                  isMember6:!this.state.isMember6
                })
                }}
                isChecked={this.state.isMember6}  
                rightText='Staff Member 6'           
            />
           
             <CheckBox    style={styles.checkBoxStyle}
                onClick={()=>{
                this.setState({
                  isMember7:!this.state.isMember7
                })
                }}
                isChecked={this.state.isMember7}         
                rightText='Staff Member 7'    
            />
           
             <CheckBox    style={styles.checkBoxStyle}
                onClick={()=>{
                this.setState({
                  isMember8:!this.state.isMember8
                })
                }}
                isChecked={this.state.isMember8}  
                rightText='Staff Member 8'       
            />
           
             <CheckBox    style={styles.checkBoxStyle}
                onClick={()=>{
                this.setState({
                  isMember9:!this.state.isMember9
                })
                }}
                isChecked={this.state.isMember9} 
                rightText='Staff Member 9'         
             />

             <CheckBox
                style={styles.checkBoxStyle}
                onClick={()=>{
                this.setState({
                  isMember10:!this.state.isMember10
                })
                }}
                isChecked={this.state.isMember10}       
                rightText='Staff Member 10'  
             /> 


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