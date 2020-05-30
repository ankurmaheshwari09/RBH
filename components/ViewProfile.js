import React from 'react';
import {
    Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View, Dimensions, Image } from 'react-native';
import { Formik } from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';
import moment from 'moment';
import {base_url,getDataAsync} from '../constants/Base';
import { ActivityIndicator } from 'react-native';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";
const ViewProfileSchema = yup.object({
    Description: yup.string().required(),
})

export default class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            showElements: false,
            showSSElements: false,
            submitAlertMessage: '',
            error: null,
            child: this.props.navigation.getParam('child'),
            updateProfile: false,
            profileDescriptionNo: '',
            changeDescription: false,
            sucessDisplay: false,
            errorDisplay: false,
            loading: false,
            isVisible: false,
            refreshPage: false,
        }
        this._submitProfile =this._submitProfile.bind(this);
        this._updateProfile =this._updateProfile.bind(this);
    }

    async componentDidMount() {
        console.log(this.state.child.childNo);
        await fetch(base_url+"/child-profile-all-description/"+this.state.child.childNo,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            //console.log(responseJson,'111');

            if(responseJson == null){
                this.state.updateProfile=false;
                this.setState({description:''});
            }
            else{
                this.state.updateProfile=true;
                this.setState({description:responseJson[0].description,
                    profileDescriptionNo:responseJson[0].profileDescriptionNo});
                console.log(this.state.description);
            
            let date_modified = responseJson[0].modified_ON;        
            let dm = moment(date_modified).format("YYYY-MM-DD");
            // console.log(dm,'formatted');
            let dm1 = moment(new Date()).format("YYYY-MM-DD");
			// console.log(dm1,'formatted new date');
            let a = new Date(dm);
            //console.log(a);
            let b = new Date(dm1);
            //console.log(b);          
            let diffInDate = b-a ;          
            // console.log(diffInDate,'difference');   //Future date - current date
            let daysTillToday = Math.floor(diffInDate/ (1000 * 60 * 60 * 24));
            console.log(daysTillToday,'daysTillToday');
            if(daysTillToday>=365){
                alert('Alert: Profile Description needs to be updated!!!');
                //this.setState({changeDescription: true});
            }
        }
    });
}

    async _submitProfile(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "description": values.Description,
                "childNo": this.state.child.childNo,
                "modified_ON": new Date()
        });
        let result = {};
        let response = await fetch(base_url+"/child-profile-description", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        let responseJson = await response.json();
        if(response.ok) {
            console.log(responseJson);
            this.setState({ loading: false, isVisible: true, successDisplay: true, refreshPage: true });
        }
        else{
            console.log(error);
            this.setState({ errorDisplay: true });
        }
    }

    async _updateProfile(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "description": values.Description,
                "childNo": this.state.child.childNo,
                "modified_ON": new Date(),
                "profileDescriptionNo": this.state.profileDescriptionNo
        });
        let result = {};
        let response = await fetch(base_url+"/child-profile-description/"+this.state.profileDescriptionNo, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        let responseJson = await response.json();
        if(response.ok){
            console.log(responseJson);
            this.setState({ loading: false, isVisible: true, successDisplay: true, refreshPage: true });
                
        }
        else {
            console.log(error,'error');
            this.setState({ errorDisplay: true });
        }
    }

    // componentWillUnmount() {
    //     const { params } = this.props.navigation.state;
    //     if(this.state.refreshPage){
    //         params.refreshChildList();
    //     }  
    // }

    navigateToChildListScreen() {
        this.setState({ isVisible: false }, () => {
            if (this.state.successDisplay) {
                this.props.navigation.navigate('ViewChild');
                const { params } = this.props.navigation.state;
                params.refreshChildList();
            }
        })
       
    }

    render() {
        return (<View style={globalStyles.formcontainer}>
              {/*Background Image*/}
              <View style={globalStyles.backgroundlogoimageview}>
                    <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
                </View>
            <View style={globalStyles.container}>
                <Formik
                enableReinitialize
                    initialValues={
                        {
                            Description: this.state.description,
                        }
                    }
                    validationSchema={ViewProfileSchema}
                    onSubmit={async (values, actions) => {
                        //actions.resetForm();
                        console.log(values);
                        let checkUpdate =  this.state.updateProfile;
                        if(checkUpdate)
                        {
                            let result = this._updateProfile(values);
                            console.log(result);
                        }
                        else
                        {
                          
                            let result = this._submitProfile(values);
                            console.log(result);
                        }
                        //this.props.navigation.push('ViewProfile', values)
                    }}
                >
        {props => (
            <KeyboardAvoidingView behavior="padding"
            enabled style={globalStyles.keyboardavoid}
            keyboardVerticalOffset={200}>
            <ScrollView>

                <View>
                    
                    <Text style={globalStyles.label}>Child Name : </Text>
                    <TextInput
                        style={globalStyles.disabledBox}
                        value={this.state.child.firstName} //value updated in 'values' is reflected here
                        editable={false}
                        selectTextOnFocus={false}
                    />
                    <Text style={globalStyles.padding}></Text>
                    <Text style={globalStyles.label}>Enter/Update Description about child:</Text>
                    <TextInput
                        style={globalStyles.inputText}
                        onChangeText={props.handleChange('Description')}
                        value={props.values.Description}
                        multiline={true}
                        numberOfLines={6}
                    />
                    <Text style={globalStyles.errormsg}>{props.touched.Description && props.errors.Description}</Text>
                    <Text style={globalStyles.padding}></Text>
                    <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

                                                    
                </View>
            </ScrollView>
            </KeyboardAvoidingView>

                    )}

        </Formik>
            <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.navigateToChildListScreen()}>
                <View style={globalStyles.MainContainer}>
                    <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                    <SuccessDisplay successDisplay={this.state.successDisplay} type='Profile' childNo={this.state.child.firstName}/>
                </View>
            </Modal>
            <LoadingDisplay loading={this.state.loading} />
            </View >
        </View >
        );
    }
}