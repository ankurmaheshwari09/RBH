import React from 'react';
import {Text, KeyboardAvoidingView, Picker, View, ScrollView, 
    TextInput, Button, ActivityIndicator} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import {base_url} from '../constants/Base';
import moment from 'moment';

const PrevEduSchema = yup.object({
    dropoutReason: yup.string(),
    yearOfStudied: yup.string()
        .test('is-num', 'Year must be a valid numer', (val) => {
            return parseInt(val) <= (new Date()).getFullYear() && parseInt(val) > 0;
        }),
    medium: yup.string(),
    schoolName: yup.string(),
    schooltype: yup.string(),
    class: yup.string(),
    schoolPlace: yup.string()
})

export default class PrevEduForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            child: this.props.navigation.getParam('child'),
            showLoader: false,
            loaderIndex: 0,
        }
    }

    getYear(date_to){
        return moment(date_to).format('YYYY')
    }

    _submitPrevEdu(values){
        let prevEducation = this.props.prevEducation
        let apimethod = "PUT"
        let url = base_url + '/child-education'
        if('newChild' in this.props.prevEducation){
            apimethod = "POST"
        }
        prevEducation.dropoutReason = values.dropOutReason
        prevEducation.date_from = new Date(parseInt(values.yearOfStudied) - 1, 4)
        prevEducation.date_to = new Date(parseInt(values.yearOfStudied), 4)
        prevEducation.medium = values.medium,
        prevEducation.schoolName = values.schoolName,
        prevEducation.schooltype = values.schooltype,
        prevEducation.studyingclass = values.class,
        prevEducation.address = values.schoolPlace,
        prevEducation.modified_on = new Date()
        fetch(url, {
            method: apimethod,
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prevEducation),
        })
        .then((response) => {console.log(response.status);return response.json()})
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully updated child with Child Number '+this.state.child.childNo});
            alert(this.state.submitAlertMessage);
            this.setState({showLoader: false,loaderIndex:0});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to update child. Plesae contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
            this.setState({showLoader: false,loaderIndex:0});
        });
    }
    render() {
        return (
            <View style = {globalStyles.container}>
                <View style={{ position: 'absolute', top:"45%",right: 0, left: 0, zIndex: this.state.loaderIndex }}>
                    <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                </View>
                <Formik
                    initialValues = {
                        {
                            dropoutReason: this.state.child.dropoutReason,
                            yearOfStudied: this.props.prevEducation.date_to ? this.getYear(this.props.prevEducation.date_to): '',
                            medium: this.props.prevEducation.medium,
                            schoolName: this.props.prevEducation.schoolName,
                            schooltype: this.props.prevEducation.schooltype,
                            class: this.props.prevEducation.studyingclass,
                            schoolPlace: this.props.prevEducation.address
                        }
                    }
                    validationSchema = {PrevEduSchema}
                    onSubmit = {(values, actions) => {
                        //actions.resetForm();
                        console.log(values)
                        this.setState({showLoader: true,loaderIndex:10});
                        let result = this._submitPrevEdu(values);
                        let alertMessage = this.state.submitAlertMessage;
                        //this.props.navigation.push('InfoGeneral', values)
                    }}
                >

                    {props => (
                        <KeyboardAvoidingView behavior = "padding"
                            enabled style = {globalStyles.keyboardavoid}
                            keyboardVerticalOffset = {150}>

                                <ScrollView
                                    showsVerticalScrollIndicator = {false}
                                >
                                    <View>
                                        <Text style = {globalStyles.text}>Drop Out Reason</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.dropoutReason && props.errors.dropoutReason }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('dropoutReason')}
                                        value = {props.values.dropoutReason}
                                        />

                                        <Text style = {globalStyles.text}>Year Of Studied</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.yearOfStudied && props.errors.yearOfStudied }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('yearOfStudied')}
                                        value = {props.values.yearOfStudied}
                                        />

                                        <Text style = {globalStyles.text}>Medium</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.medium && props.errors.medium }</Text>
                                        <Picker
                                        selectedValue = {props.values.medium}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('medium', value)
                                        }}
                                        >
                                            <Picker.Item label="Select Medium" value="" />
                                            {global.medium.map((item) => {
                                                return <Picker.Item key = {item.motherTongueId} label = {item.motherTongue} value = {item.motherTongueId}/>
                                            })}
                                    
                                        </Picker>

                                        <Text style = {globalStyles.text}>School Name</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schoolName && props.errors.schoolName }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('schoolName')}
                                        value = {props.values.schoolName}
                                        />

                                        <Text style = {globalStyles.text}>School Type</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schooltype && props.errors.schooltype }</Text>
                                        <Picker
                                        selectedValue = {props.values.schooltype}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('schooltype', value)
                                        }}
                                        >
                                            <Picker.Item label="Select School Type" value="" />
                                            {global.schoolType.map((item) => {
                                                return <Picker.Item key = {item.schoolTypeID} label = {item.schoolType} value = {item.schoolTypeID}/>
                                            })}
                                    
                                        </Picker>

                                        <Text style = {globalStyles.text}>Class</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.class && props.errors.class }</Text>
                                        <Picker
                                        selectedValue = {props.values.class}
                                        style = {globalStyles.dropDown}
                                        onValueChange = {value => {
                                            props.setFieldValue('class', value)
                                        }}
                                        >
                                            <Picker.Item label="Select Class" value="" />
                                            {global.class.map((item) => {
                                                return <Picker.Item key = {item.studyingclassId} label = {item.studyingclass} value = {item.studyingclassId}/>
                                            })}
                                    
                                        </Picker>

                                        <Text style = {globalStyles.text}>School Place</Text>
                                        <Text style = {globalStyles.errormsg}>{ props.touched.schoolPlace && props.errors.schoolPlace }</Text>
                                        <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('schoolPlace')}
                                        value = {props.values.schoolPlace}
                                        />
                                        <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                    </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                    )}

                </Formik>

            </View>
        );
    }
}