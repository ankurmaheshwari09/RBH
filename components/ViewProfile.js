import React from 'react';
import {
    Button, Text, TextInput, View, ScrollView,
    KeyboardAvoidingView, Field,
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/samplestyles';
import * as yup from 'yup';
import moment from 'moment';
import {base_url,getDataAsync} from '../constants/Base';
import { ActivityIndicator } from 'react-native';
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
            editText:false,
        }
        this._submitProfile =this._submitProfile.bind(this);
        this._updateProfile =this._updateProfile.bind(this);
        //this.handleChange=this.handleChange.bind(this);
    }

    // handleChange = (value) => {  
    //     this.setState({ description: value })  
    //   }  

    componentDidMount() {
        console.log(this.state.child.childNo);
        fetch(base_url+"/child-profile-all-description/"+this.state.child.childNo,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            console.log(responseJson,'111');

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
             console.log(dm,'formatted');
            let dm1 = moment(new Date()).format("YYYY-MM-DD");
			 console.log(dm1,'formatted new date');
            let a = new Date(dm);
            console.log(a);
            let b = new Date(dm1);
            console.log(b);          
            let diffInDate = b-a ;          
             console.log(diffInDate,'difference');   //Future date - current date
            let daysTillToday = Math.floor(diffInDate/ (1000 * 60 * 60 * 24));
            console.log(daysTillToday,'daysTillToday');
            if(daysTillToday>=365){
                alert('Alert: Update Profile!!!');
            }
        }
    });
}

    _submitProfile(values) {
        let request_body = JSON.stringify({
                "description": values.Description,
                "childNo": this.state.child.childNo,
                "modified_ON": new Date()
        });
        let result = {};
        fetch(base_url+"/child-profile-description", {
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
            this.setState({submitAlertMessage: 'Successfully added profile description for \n'
            +'Child Number:'+responseJson.childNo+'\nProfile Description Number:'+responseJson.profileDescriptionNo});
            
            alert(this.state.submitAlertMessage);
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add Details. Plesae contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
        });
    }

    _updateProfile(values) {
        let request_body = JSON.stringify({
                "description": values.Description,
                "childNo": this.state.child.childNo,
                "modified_ON": new Date(),
                "profileDescriptionNo": this.state.profileDescriptionNo
        });
        let result = {};
        fetch(base_url+"/child-profile-description/"+this.state.profileDescriptionNo, {
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
            this.setState({submitAlertMessage: 'Successfully updated profile description for \n'
            +'Child Number:'+responseJson.childNo+'\nProfile Description Number:'+responseJson.profileDescriptionNo});           
            alert(this.state.submitAlertMessage);
            fetch(base_url+"/child-profile-all-description/"+this.state.child.childNo,{
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then((response)=>response.json())
            .then((responseJson)=>{
                console.log(responseJson,'222');
            })
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to update details. Plesae contact the Admin.'});
            alert(this.state.submitAlertMessage);
            console.log(error);
        });
    }

   

    render() {
        return (<View style={globalStyles.container1}>
            <View style={globalStyles.container}>
                <Formik
                    initialValues={
                        {
                            Description: '',
                          
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
                        this.props.navigation.push('ViewProfile', values)
                    }}
                >
        {props => (
            <KeyboardAvoidingView behavior="padding"
                enabled style={globalStyles.keyboardavoid}
                keyboardVerticalOffset={200}>
                <ScrollView>

                    <View>
                        if(this.state.updateProfile){
                        <Text style={globalStyles.text}>Child Name : {this.state.child.firstName}</Text>}
                        <Text style={globalStyles.text}>Entered Description is : {this.state.description}</Text>}
                        <Text style={globalStyles.text}>Enter/Update Description about child:</Text>
                        {/* <Text style={globalStyles.text}>Entered  :{props.values.Description} </Text> */}
                        <TextInput
                            style={globalStyles.input}
                            value={props.values.Description}
                            onChangeText={props.handleChange('Description')}
                        //    onChangeText={text => props.setFieldValue('Description', text)}
                        //   value={props.values.Description} 
                        />
                        <Text style={globalStyles.errormsg}>{props.touched.Description && props.errors.Description}</Text>
                         <Text style={globalStyles.padding}></Text>
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