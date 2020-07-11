import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView, KeyboardAvoidingView, Image
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { globalStyles } from '../styles/global';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const ResultFormSchema = yup.object({
    Class: yup.string().required()
})

export default class ChildResultScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            child: this.props.navigation.getParam('child'),
        }
    }
    getApiMethod(prevEducation) {
        if ('newChild' in this.props.prevEducation) {
            prevEducation.modified_on = new Date()
            return UpdateApi.addData(JSON.stringify(prevEducation), 'child-education')
        }
        else {
            return UpdateApi.updateData(JSON.stringify(prevEducation), 'child-education')
        }
    }
    examResultsubmit(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
            "childNo": this.state.child.childNo,
            "examId": values.Class,
            "appeared": values.Appeared,
            "result": values.Result,
            "percentage": values.Percentage,
        });
        console.log(values);
        const path = `exam-results`;
        UpdateApi.addData(request_body, path).then((response) => {
            this.setState({ loading: false, isVisible: true });
            if (response.ok) {
                response.json().then((res) => {
                    console.log(res + "res");
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
        if (this.state.successDisplay) {
            const { params } = this.props.navigation.state;
            params.refreshChildList();
        }

    }
    render() {
        return (<View style={globalStyles.container}>
            <View style={globalStyles.backgroundlogoimageview}>
                <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
            </View>

            <Formik
                initialValues={
                    {
                        Class: this.props.prevEducation ? this.props.prevEducation : '',
                        Appeared: '',
                        Result: '',
                        Percentage: '',
                    }
                }
                validationSchema={ResultFormSchema}
                onSubmit={async (values, actions) => {
                    console.log(values);
                    console.log("Submit method called here ");
                    this.setState({ showLoader: true, loaderIndex: 10 });
                    let result = this.examResultsubmit(values);
                    let alertMessage = this.state.submitAlertMessage;
                    console.log(result);
                    actions.resetForm();
                }}
            >
                {props => (
                    <KeyboardAvoidingView behavior="padding"
                        enabled style={globalStyles.keyboardavoid}
                        keyboardVerticalOffset={200}>
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

                                {/*Child Class*/}
                                <Text style={globalStyles.label}>Class: <Text style={{ color: "red" }}>*</Text> </Text>
                                <Picker
                                    selectedValue={props.values.Class}
                                    style={globalStyles.dropDown}
                                    onValueChange={(Class) => props.setFieldValue('Class', Class)}
                                    value={props.values.Class}
                                >
                                    <Picker.Item color='grey' label="Select Class" value="" />
                                    {global.studyingclass.map((item) => {
                                        return <Picker.Item key={item.studyingclassId} label={item.studyingclass} value={item.studyingclassId} />
                                    })}
                                </Picker>
                                <Text style={globalStyles.errormsg}>{props.touched.Class && props.errors.Class}</Text>

                                {/*Appeared*/}
                                <Text style={globalStyles.label}>Appeared:</Text>
                                <Picker
                                    selectedValue={props.values.Appeared}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('Appeared')}
                                >
                                    <Picker.Item color='grey' label="Select" value="" />
                                    <Picker.Item label="Yes" value="Y" />
                                    <Picker.Item label="No" value="N" />
                                </Picker>
                                <Text></Text>

                                {/*Result*/}
                                <Text style={globalStyles.label}>Result:</Text>
                                <Picker
                                    selectedValue={props.values.Result}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('Result')}
                                >
                                    <Picker.Item color='grey' label="Select" value="" />
                                    <Picker.Item label="Pass" value="PASS" />
                                    <Picker.Item label="Fail" value="FAIL" />
                                </Picker>
                                <Text></Text>

                                {/*Percentage*/}
                                <Text style={globalStyles.label}>Percentage:</Text>
                                <TextInput
                                    style={globalStyles.input}
                                    onChangeText={props.handleChange('Percentage')}
                                    value={props.values.Percentage}
                                />
                                <Text></Text>
                                <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>

                )}

            </Formik>
            <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                <View style={globalStyles.MainContainer}>
                    <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                    <SuccessDisplay successDisplay={this.state.successDisplay} type='Exam Result' childNo={this.state.child.firstName} />
                </View>
            </Modal>
            <LoadingDisplay loading={this.state.loading} />
        </View >
        );
    }
}