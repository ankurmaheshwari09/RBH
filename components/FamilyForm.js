import React from 'react';
import {
    Button, Text, TextInput, Image, View, Picker, ScrollView, StyleSheet, FlatList, TouchableOpacity,
    KeyboardAvoidingView, Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import { globalStyles } from '../styles/global';
import * as yup from 'yup';
import { base_url, getDataAsync } from '../constants/Base';
import { Card, CardContent } from 'react-native-cards'
import { MaterialIcons } from '@expo/vector-icons';
import { Item } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const FamilyFormSchema = yup.object({
    Name: yup.string().required(),
    Relation: yup.string().required(),
    Occupation: yup.string().required(),
    Age: yup.string(),
    Present: yup.string().required(),
    Remarks: yup.string(),
    Income: yup.string(),
})

let arr = "";

export default class FamilyForm extends React.Component {
    constructor(props) {
        super(props);
        this.getStyles = this.getStyles.bind(this);
        // this.show =this.show.bind(this);
    }
    reviews = [];
    family = [];
    deletedValues = [];
    state = {
        initialDeleteStatus: '1',
        afterDeleteStatus:'0',
        modalVisible: false,
        child: this.props.navigation.getParam('child'),
        modaledit: false,
        loading: false,
        sucessDisplay: false,
        errorDisplay: false,
        isVisibleMsg: false,
        viewItem:true,
        submitAlertMessage: '',
        loaderIndex: 0,
        relations: [],
        occupations: [],
        childFamilyList: [],
        childFamilyDetails:[],
        familyDetails: [],
        updatefamily: [],
        presentConditions: [
            {
                presentId: 1,
                present:"Alive",
            },
            {
                presentId: 2,
                present: "Late",
            },
            {
                presentId: 3,
                present: "Married",
            },
            {
                presentId: 4,
                present: "Single",
            },
            {
                presentId: 5,
                present: "Divorced",
            }
        ],
        display:[],
        error:null
    };

    async familyFormConstants() {
 
        getDataAsync(base_url + '/relations').then(data => { console.log(data); this.setState({ relations: data }) });

        getDataAsync(base_url + '/occupations').then(data => { console.log(data); this.setState({ occupations: data }) });
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.familyFormConstants();
        console.log("=============", this.state.child.childNo);
        fetch(base_url + '/child-family/' + this.state.child.childNo, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((resJson) => {
                this.setState({
                    childFamilyList: resJson,
                    //display: [{ familyDisplay: this.state.childFamilyList }, { relationDisplay: this.state.relations.relation }],
                    // error: res.error || null,
                    loading: false,
                });
                //for (var i = 0; i < this.state.childFamilyList.length; i++) {
                
              
               
                    console.log("ncdiuuir", this.state.childFamilyList);
                    // this.arrayholder = res;
               // }
            })
            ;
    }
    renderDetails = () => {
        let items = this.reviews.map((v, i) => {
            return { id: i };
        })
        this.setState = {reviews:items};
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    setModaledit(visible) {
        this.setState({ modaledit: visible });
    }
    getStyles(deleteStatus) {
        if (deleteStatus == this.state.initialDeleteStatus) {
            return styles.blue;
        }
        else {
            return styles.green;
        }
    }

    _submitFamilyForm(values) {
        console.log("post", values);
        this.setState({ loading: true });
        let request_body = JSON.stringify({
            childNo: this.state.child.childNo,
            name: values.Name,
            relation: values.Relation,
            occupation: values.Occupation,
            age: values.Age,
            presentcondition: values.Present,
            remarks: values.Remarks,
            income: values.Income,
            deletestatus: this.state.initialDeleteStatus,
        });
        let result = {};
        fetch(base_url + "/child-family", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
            .then((response) => response.json())
            .then((responseJson) => {
               
                this.setState({ familyDetails: responseJson });
                console.log("response.......", responseJson);
                this.setState({ successDisplay: true });
               // this.setState({ loading: true, loaderIndex: 0 });
                fetch(base_url + '/child-family/' + this.state.child.childNo, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
                    .then((res) => res.json())
                    .then((resJson) => {
                        this.setState({ loading: false });
                        this.setState({
                            childFamilyList: resJson,
                            //display: [{ familyDisplay: this.state.childFamilyList }, { relationDisplay: this.state.relations.relation }],
                            // error: res.error || null,
                            loading: false,
                        });
                        // this.setState({ loading: false });
                        this.setState({ isVisibleMsg: true });
                        this.setState({ successDisplay: true });
                        //alert("submitted data");
                        console.log("ncdiuuir", this.state.childFamilyList);
                        // this.arrayholder = res;
                    })
                    ;
            })
            .catch((error) => {
               // this.setState({ loading: false });
                this.setState({ errorDisplay: true });
                console.log(error);
                this.setState({ loading: false, loaderIndex: 0 });
            });
    }

    _updateSubmitFamilyForm(values) {
        console.log("put", values);
        this.setState({ loading: true, loaderIndex: 0 });
        let request_body = JSON.stringify({
            childNo: this.state.child.childNo,
            familyNo: this.family.familyNo,
            name: values.Name,
            relation: values.Relation,
            occupation: values.Occupation,
            age: values.Age,
            presentcondition: values.Present,
            remarks: values.Remarks,
            income: values.Income,
            deletestatus: this.state.initialDeleteStatus
        });
        let result = {};
        fetch(base_url + "/child-family", {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ familyDetails: responseJson });
                console.log("[[[[[[[[[[", responseJson);
                
               
               // this.setState({ loading: true, loaderIndex: 0 });
                fetch(base_url + '/child-family/' + this.state.child.childNo, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
                    .then((res) => res.json())
                    .then((resJson) => {
                        this.setState({
                            childFamilyList: resJson,
                            //display: [{ familyDisplay: this.state.childFamilyList }, { relationDisplay: this.state.relations.relation }],
                            // error: res.error || null,
                            loading: false,
                        });
                        this.setState({ isVisibleMsg: true });
                        this.setState({ successDisplay: true });
                        console.log("ncdiuuir", this.state.childFamilyList);
                        // this.arrayholder = res;
                    })
                    ;
            })
            .catch((error) => {
                this.setState({ isVisibleMsg: true });
                this.setState({ errorDisplay: true });
                console.log(error);
                this.setState({ loading: false, loaderIndex: 0 });
            });
    }


    onPressForDelete(item) {
       // alert("Deleted family details with familyID :" + id);
        console.log(item);
        this.setState({ loading: true, loaderIndex: 0 });
        console.log(".........id", item.familyNo);
        for (var i = 0; i < this.state.childFamilyList.length; i++) {
            console.log(".........", this.state.childFamilyList[i].familyNo);
            if (this.state.childFamilyList[i].familyNo === item.familyNo)
                this.family = this.state.childFamilyList[i];
            console.log(".........details*", this.state.childFamilyList[i].familyNo);
        }
            //this.setState({ initialDeleteStatus: this.state.afterDeleteStatus })
                //this.state.childFamilyList.splice(i, 1);
                //console.log(this.state.childFamilyList);
                this.setState({ loading: true, loaderIndex: 0 });
                let request_body = JSON.stringify({
                    childNo: item.childNo,
                    familyNo: item.familyNo,
                    name: item.name,
                    relation: item.relation,
                    occupation: item.occupation,
                    age: item.age,
                    presentcondition: item.presentcondition,
                    remarks: item.remarks,
                    income: item.income,
                    deletestatus: this.state.afterDeleteStatus
                });
                let result = {};
                fetch(base_url + "/child-family", {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: request_body,
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({ familyDetails: responseJson });
                        console.log(".........after*", this.state.childFamilyList[i]);
                        console.log("[[[[[[[[[[", responseJson);


                        // this.setState({ loading: true, loaderIndex: 0 });
                        fetch(base_url + '/child-family/' + this.state.child.childNo, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((res) => res.json())
                            .then((resJson) => {
                                this.setState({
                                    childFamilyList: resJson,
                                    //display: [{ familyDisplay: this.state.childFamilyList }, { relationDisplay: this.state.relations.relation }],
                                    // error: res.error || null,
                                    loading: false,
                                });
                                this.setState({ isVisibleMsg: true });
                                this.setState({ successDisplay: true });
                                console.log("ncdiuuir", this.state.childFamilyList);
                                // this.arrayholder = res;
                            })
                            ;
                    })
                    .catch((error) => {
                        this.setState({ isVisibleMsg: true });
                        this.setState({ errorDisplay: true });
                        console.log(error);
                        this.setState({ loading: false, loaderIndex: 0 });
                    });
            
        }
        
    
    onPressForEdit(id) {
       // alert("Deleted family details with familyID :" + id);

        for (var i = 0; i < this.state.childFamilyList.length; i++) {
            
            if (this.state.childFamilyList[i].familyNo === id) {
                console.log(".........", this.props.navigation.getParam('Present'));
                this.family = this.state.childFamilyList[i];
                console.log("/////", this.family.presentcondition.toString());
                //this.setState({ updatefamily: family });

            }
        }
        //this.reviews = this.reviews.splice(id-1,1);
        console.log("update family details inn edit",this.family);
        this.setModaledit(true);
        //this.setModalVisible(this.state.modalVisible)
        //console.log(this.reviews);
           
    }
    render() {
        return (
            <View style={globalStyles.container}>
                
                <View style={globalStyles.backgroundlogoimageview}>
                    <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
                </View>
                <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisibleMsg} onBackdropPress={() => this.setState({ isVisibleMsg: false })}>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='Family Details' childNo={this.state.child.firstName} />
                    </View>
                </Modal>
                
                <Modal visible={this.state.modalVisible}>
                    <View style={globalStyles.container}>
                        <MaterialIcons
                            name='close'
                            size={24}
                            style={{ ...styles.modalToggle, ...styles.modalClose }}
                            onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        />

                        <View style={globalStyles.backgroundlogoimageview}>
                            <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
                        </View> 

                            <Formik
                                initialValues={
                                    {
                                        Name: '',
                                        Relation: '',
                                        Occupation: '',
                                        Age: '',
                                        Present: '',
                                        Remarks: '',
                                        Income: '',
                                    }
                                }
                                validationSchema={FamilyFormSchema}
                                onSubmit={async (values, actions) => {
                                    actions.resetForm();
                                    console.log(values);
                                    console.log("Submit method called here ");
                                    this.setState({ showLoader: true, loaderIndex: 10 });
                                    let result = this._submitFamilyForm(values);
                                    let alertMessage = this.state.submitAlertMessage;
                                    console.log(result);
                                    this.reviews = this.reviews.concat(values);
                                    // alert("Data Has been submitted");
                                    this.setModalVisible(!this.state.modalVisible);

                                    //this.setState(this.reviews.review.concat(values));
                                    console.log("final", this.reviews);


                                    this.reviews.map((v, i) => {
                                        // arr = v;

                                        console.log(".....id", i + 1);
                                        console.log(".....name", v.Name);

                                    })
                                    this.props.navigation.navigate('FamilyForm', values)


                                }}
                            >
                                {props => (
                                    <KeyboardAvoidingView
                                        enabled style={globalStyles.keyboardavoid}
                                    >
                                    <ScrollView showsVerticalScrollIndicator={false}>

                                            <View>
                                            <Text style={globalStyles.label}>Name :</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Name')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Name} //value updated in 'values' is reflected here
                                            />
                                            <Text style={globalStyles.errormsg}>{props.touched.Name && props.errors.Name}</Text>
                                            <Text style={globalStyles.label}>Relation :</Text> 
                                                <Picker
                                                    selectedValue={props.values.Relation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Relation', value);
                                                    }}
                                                >
                                                <Picker.Item color='grey' label="Select Relation" value="" />
                                                    {
                                                        this.state.relations.map((item) => {
                                                            return <Picker.Item key={item.relationNo} label={item.relation} value={item.relationNo} />
                                                        })
                                                    }
                                            </Picker>
                                            <Text style={globalStyles.errormsg}>{props.touched.Relation && props.errors.Relation}</Text>
                                            <Text style={globalStyles.label}>Age :</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Age && props.errors.Age}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Age')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Age} //value updated in 'values' is reflected here
                                                />
                                            <Text style={globalStyles.label}>Occupation :</Text>
                                                <Picker
                                                    selectedValue={props.values.Occupation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Occupation', value);
                                                    }}
                                                >
                                                <Picker.Item color='grey' label="Select Occupation" value="" />
                                                    {
                                                        this.state.occupations.map((item) => {
                                                            return <Picker.Item key={item.occupationNo} label={item.occupation} value={item.occupationNo} />
                                                        })
                                                    }
                                            </Picker>
                                            <Text style={globalStyles.errormsg}>{props.touched.Occupation && props.errors.Occupation}</Text>
                                            <Text style={globalStyles.label}>Present :</Text>
                                                <Picker
                                                    selectedValue={props.values.Present}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Present', value);
                                                    }}
                                                >
                                                <Picker.Item color='grey' label="Select Present Condition" value="" />
                                                    {
                                                        this.state.presentConditions.map((item) => {
                                                            return <Picker.Item key={item.presentId} label={item.present} value={item.presentId} />
                                                        })
                                                    }
                                            </Picker>
                                            <Text style={globalStyles.errormsg}>{props.touched.Present && props.errors.Present}</Text>
                                            <Text style={globalStyles.label}>Income :</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Income')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Income} //value updated in 'values' is reflected here
                                                />
                                            <Text style={globalStyles.label}>Remarks :</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Remarks && props.errors.Remarks}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Remarks')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Remarks} //value updated in 'values' is reflected here
                                                />
                                                <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                            </View>
                                        </ScrollView>
                                    </KeyboardAvoidingView>

                                )}

                            </Formik>
                            
                        
                    </View>
                </Modal>
                
                <LoadingDisplay loading={this.state.loading} />
                <Modal visible={this.state.modaledit} animationType='slide'>
                  
                    <View style={globalStyles.container}>
                    <View style={globalStyles.backgroundlogoimageview}>
                        <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
                    </View>
                        
                            <Formik
                                initialValues={
                                    {
                                        Name: this.family.name,
                                        Relation: this.family.relation,
                                        Occupation: this.family.occupation,
                                        Age: this.family.age,
                                        Present: this.family.presentcondition,
                                        Remarks: this.family.remarks,
                                        Income: this.family.income,
                                    }
                                }
                                validationSchema={FamilyFormSchema}
                                onSubmit={async (values, actions) => {
                                    actions.resetForm();
                                    console.log(values);
                                    console.log("Submit method called here ");
                                    this.setState({ showLoader: true, loaderIndex: 10 });
                                    let result = this._updateSubmitFamilyForm(values);
                                    let alertMessage = this.state.submitAlertMessage;
                                    console.log(result);
                                    this.reviews = this.reviews.concat(values);
                                    // alert("Data Has been submitted");
                                    this.setModaledit(!this.state.modaledit);

                                    //this.setState(this.reviews.review.concat(values));
                                    console.log("final", this.reviews);


                                    this.reviews.map((v, i) => {
                                        // arr = v;

                                        console.log(".....id", i + 1);
                                        console.log(".....name", v.Name);

                                    })
                                    this.props.navigation.navigate('FamilyForm', values)


                                }}
                            >
                                {props => (
                                    <KeyboardAvoidingView
                                        enabled style={globalStyles.keyboardavoid}
                                    >
                                    <ScrollView showsVerticalScrollIndicator={false}>

                                            <View>
                                            <Text style={globalStyles.label}>Name :</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Name')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Name} //value updated in 'values' is reflected here
                                            />
                                            <Text style={globalStyles.errormsg}>{props.touched.Name && props.errors.Name}</Text>
                                            <Text style={globalStyles.label}>Relation :</Text>
                                                <Picker
                                                    selectedValue={props.values.Relation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Relation', value);
                                                    }}
                                                >
                                                <Picker.Item color='grey' label="Select Relation" value="" />
                                                    {
                                                        this.state.relations.map((item) => {
                                                            return <Picker.Item key={item.relationNo} label={item.relation} value={item.relationNo} />
                                                        })
                                                    }
                                            </Picker>
                                            <Text style={globalStyles.errormsg}>{props.touched.Relation && props.errors.Relation}</Text>
                                            <Text style={globalStyles.label}>Age :</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Age && props.errors.Age}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Age')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Age} //value updated in 'values' is reflected here
                                                />
                                            <Text style={globalStyles.label}>Occupation :</Text> 
                                                <Picker
                                                    selectedValue={props.values.Occupation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Occupation', value);
                                                    }}
                                                >
                                                <Picker.Item color='grey' label="Select Occupation" value="" />
                                                    {
                                                        this.state.occupations.map((item) => {
                                                            return <Picker.Item key={item.occupationNo} label={item.occupation} value={item.occupationNo} />
                                                        })
                                                    }
                                            </Picker>
                                            <Text style={globalStyles.errormsg}>{props.touched.Occupation && props.errors.Occupation}</Text>
                                            <Text style={globalStyles.label}>Present :</Text>
                                                <Picker
                                                    selectedValue={props.values.Present}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Present', value);
                                                    }}
                                                >
                                                <Picker.Item color='grey' label="Select Present Condition" value="" />
                                                    {
                                                        this.state.presentConditions.map((item) => {
                                                            return <Picker.Item key={item.presentId} label={item.present} value={item.presentId} />
                                                        })
                                                    }
                                            </Picker>
                                            <Text style={globalStyles.errormsg}>{props.touched.Present && props.errors.Present}</Text>
                                            <Text style={globalStyles.label}>Income :</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Income')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Income} //value updated in 'values' is reflected here
                                            />
                                            <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                            <Text style={globalStyles.label}>Remarks :</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Remarks')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Remarks} //value updated in 'values' is reflected here
                                            />
                                            <Text style={globalStyles.errormsg}>{props.touched.Remarks && props.errors.Remarks}</Text>
                                                <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />
                                            </View>
                                        </ScrollView>
                                    </KeyboardAvoidingView>

                                )}

                            </Formik>
                          
                       
                        </View>
                    
                </Modal>

                <MaterialIcons
                    name='add'
                    size={24}
                    style={{ ...styles.modalToggle, ...styles.modalClose }}
                    onPress={() => this.setModalVisible(true)}
                />
                
                
                <View style={styles.bottom}>
                <FlatList
                        data={this.state.childFamilyList}
                       
                        showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                       
                        <View style={{ flexDirection: 'column'}}>

                            <TouchableOpacity style={styles.container}>

                                    {/*react-native-elements Card*/}

                            <Card border="secondary" style={{ borderWidth: 1 }}>
                                        <CardContent style={styles.paragraph}>
                                        <Text>
                                        <Text style={{ fontWeight: "bold" }}>Name : </Text>
                                        <Text>{`${item.name}`}</Text>
                                        </Text>
                                        <Text>
                                            <Text style={{ fontWeight: "bold" }}>Relation : </Text>
                                        <Text>{`${item.relationType}`}</Text>
                                    </Text>
                                <Text>
                                            <Text style={{ fontWeight: "bold" }}>Age : </Text>
                                        <Text>{`${item.age}`}</Text>
                                        </Text>
                                        <Text>
                                            <Text style={{ fontWeight: "bold" }}>Occupation : </Text>
                                        <Text>{`${item.occupationType}`}</Text>
                                        </Text>
                                        <Text>
                                            <Text style={{ fontWeight: "bold" }}>Present : </Text>
                                        <Text>{`${item.presentconditionType}`}</Text>
                                            </Text>
                                    <Text>
                                            <Text style={{ fontWeight: "bold" }}>Income : </Text>
                                        <Text>{`${item.income}`}</Text>
                                        </Text>
                                        <Text>
                                            <Text style={{ fontWeight: "bold" }}>Remarks : </Text>
                                        <Text>{`${item.remarks}`}</Text>
                                        </Text>
                                        </CardContent>
                                        <MaterialIcons
                                            name='edit'
                                            size={18}
                                            style={styles.Icons}
                                            onPress={() => this.onPressForEdit(item.familyNo)}
                                        />
                                        <MaterialIcons
                                            name='delete'
                                            size={18}
                                            style={styles.Icons}
                                            onPress={() => this.onPressForDelete(item)}
                                        />

                                    </Card>

                                

                            </TouchableOpacity>
                           
                        </View>
                    
                            
                    )}
                    //Setting the number of column
                    numColumns={1}
                            keyExtractor={(item, index) => index.toString()}
                            
                //keyExtractor={this.reviews.name}
                />
                    </View> 
               
            </View>
            
    
           
        );
        
    }

}
const styles = StyleSheet.create({
    modalToggle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    Icons: {
    
        alignItems: 'flex-end',
        marginBottom: 10,
        marginRight:10,
        borderWidth: 1,
        borderColor: '#f2f2f2',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-end',
    },
    modalClose: {
        marginTop: 20,
        marginBottom: 0,
    },
    modalContent: {
        flex: 1,
    },
    MainContainer: {
        flex: 1,
        flexDirection:"row",
        margin:10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2 + 50,
        maxHeight: Dimensions.get('window').height / 4,
        top: 150,
        borderRadius: 30
    },
    paragraph: {
        padding: 20,
        
    }, bottom: {
        marginBottom: 100,
        marginTop:10
    },
    green: {
        backgroundColor: '#ABEBC6',
        //  borderWidth: 5,
    },
    container: {
        // width : 150,
        height: 200,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
        //marginBottom:50
        // borderRadius : 15,
       
         backgroundColor : '#FFFFFF',
    }
});
