import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView, Modal, StyleSheet, FlatList, TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
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
                this.setState({ loading: false });
                this.setState({ familyDetails: responseJson });
                console.log("response.......", responseJson);
               
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
                       // this.setState({ loading: false });
                        this.setState({ successDisplay: true });
                        
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
                        this.setState({ isVisible: true });
                        this.setState({ successDisplay: true });
                        console.log("ncdiuuir", this.state.childFamilyList);
                        // this.arrayholder = res;
                    })
                    ;
            })
            .catch((error) => {
                this.setState({ isVisible: true });
                this.setState({ errorDisplay: true });
                console.log(error);
                this.setState({ loading: false, loaderIndex: 0 });
            });
    }


    onPressForDelete(item) {
       // alert("Deleted family details with familyID :" + id);
        console.log(item);

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
                                this.setState({ submitAlertMessage: 'Successfully deleted family with family Number ' + item.familyNo });
                                alert(this.state.submitAlertMessage);
                                console.log("ncdiuuir", this.state.childFamilyList);
                                // this.arrayholder = res;
                            })
                            ;
                    })
                    .catch((error) => {
                        this.setState({ submitAlertMessage: 'Unable to delete child. Plesae contact the Admin.' });
                        alert(this.state.submitAlertMessage);
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
            <View>
                <Modal visible={this.state.isVisibleMsg} animationType='slide'>
                    <View style={globalStyles.MainContainer}>
                        <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                        <SuccessDisplay successDisplay={this.state.successDisplay} type='General Info' childNo={this.state.child.firstName} />
                    </View>
               </Modal>
                <Modal visible={this.state.modalVisible} animationType='slide'>
                    <View style={styles.modalContent}>
                        <MaterialIcons
                            name='close'
                            size={24}
                            style={{ ...styles.modalToggle, ...styles.modalClose }}
                            onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        />

                        <View style={globalStyles.container}>

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
                                        <ScrollView>

                                            <View>
                                                <Text style={globalStyles.text}>Name</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Name && props.errors.Name}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Name')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Name} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Relation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Relation && props.errors.Relation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Relation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Relation', value);
                                                    }}
                                                >
                                                    <Picker.Item label="Select Relation" value="" />
                                                    {
                                                        this.state.relations.map((item) => {
                                                            return <Picker.Item key={item.relationNo} label={item.relation} value={item.relationNo} />
                                                        })
                                                    }
                                                </Picker>
                                                <Text style={globalStyles.text}>Age</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Age && props.errors.Age}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Age')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Age} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Occupation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Occupation && props.errors.Occupation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Occupation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Occupation', value);
                                                    }}
                                                >
                                                    <Picker.Item label="Select Occupation" value="" />
                                                    {
                                                        this.state.occupations.map((item) => {
                                                            return <Picker.Item key={item.occupationNo} label={item.occupation} value={item.occupationNo} />
                                                        })
                                                    }
                                                </Picker>
                                                <Text style={globalStyles.text}>Present</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Present && props.errors.Present}</Text>
                                                <Picker
                                                    selectedValue={props.values.Present}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Present', value);
                                                    }}
                                                >
                                                    <Picker.Item label="Select Present Condition" value="" />
                                                    {
                                                        this.state.presentConditions.map((item) => {
                                                            return <Picker.Item key={item.presentId} label={item.present} value={item.presentId} />
                                                        })
                                                    }
                                                </Picker>
                                                <Text style={globalStyles.text}>Income</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Income')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Income} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Remarks</Text>
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
                    </View>
                </Modal>
                
                <LoadingDisplay loading={this.state.loading} />
                <Modal visible={this.state.modaledit} animationType='slide'>
                    <View style={styles.modalContent}>
                        <View style={globalStyles.container}>

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
                                        <ScrollView>

                                            <View>
                                                <Text style={globalStyles.text}>Name</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Name && props.errors.Name}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Name')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Name} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Relation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Relation && props.errors.Relation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Relation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Relation', value);
                                                    }}
                                                >
                                                    <Picker.Item label="Select Relation" value="" />
                                                    {
                                                        this.state.relations.map((item) => {
                                                            return <Picker.Item key={item.relationNo} label={item.relation} value={item.relationNo} />
                                                        })
                                                    }
                                                </Picker>
                                                <Text style={globalStyles.text}>Age</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Age && props.errors.Age}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Age')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Age} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Occupation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Occupation && props.errors.Occupation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Occupation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Occupation', value);
                                                    }}
                                                >
                                                    <Picker.Item label="Select Occupation" value="" />
                                                    {
                                                        this.state.occupations.map((item) => {
                                                            return <Picker.Item key={item.occupationNo} label={item.occupation} value={item.occupationNo} />
                                                        })
                                                    }
                                                </Picker>
                                                <Text style={globalStyles.text}>Present</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Present && props.errors.Present}</Text>
                                                <Picker
                                                    selectedValue={props.values.Present}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={value => {
                                                        props.setFieldValue('Present', value);
                                                    }}
                                                >
                                                    <Picker.Item label="Select Present Condition" value="" />
                                                    {
                                                        this.state.presentConditions.map((item) => {
                                                            return <Picker.Item key={item.presentId} label={item.present} value={item.presentId} />
                                                        })
                                                    }
                                                </Picker>
                                                <Text style={globalStyles.text}>Income</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                                <TextInput
                                                    style={globalStyles.inputText}
                                                    onChangeText={props.handleChange('Income')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Income} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Remarks</Text>
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
                    </View>
                </Modal>

                <MaterialIcons
                    name='add'
                    size={24}
                    style={styles.modalToggle}
                    onPress={() => this.setModalVisible(true)}
                />
                
                
                <View style={styles.bottom}>
                <FlatList
                    data={this.state.childFamilyList}
                    renderItem={({ item, index }) => (
                       
                        <View style={{ flexDirection: 'column'}}>
                           
                                <TouchableOpacity style={styles.container} >

                                    {/*react-native-elements Card*/}

                                    <Card>
                                        <CardContent style={styles.paragraph}>
                                            <Text>Name :{`${item.name}`}</Text>
                                            <Text>Relation : {`${item.relationType}`}</Text>
                                            <Text>Age : {`${item.age}`}</Text>
                                            <Text>Occupation : {`${item.occupationType}`}</Text>
                                            <Text>Present :{`${item.presentconditionType}`}</Text>
                                            <Text>Income : {`${item.income}`}</Text>
                                            <Text>Remarks :{`${item.remarks}`}</Text>

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
        borderColor: '#f2f2f2',
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
    paragraph: {
        padding: 20,
        
    }, bottom: {
        marginBottom: 150,
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
        // backgroundColor : '#FFFFFF',
    }
});
