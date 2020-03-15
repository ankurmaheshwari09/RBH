import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView, Modal, StyleSheet, FlatList, TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/global';
import * as yup from 'yup';
import { Card, CardContent } from 'react-native-cards'
import { MaterialIcons } from '@expo/vector-icons';
import { Item } from 'native-base';

const FamilyFormSchema = yup.object({
    Name: yup.string(),
    Relation: yup.string(),
    Occupation: yup.string(),
    Age: yup.string(),
    Present: yup.string(),
    Remarks: yup.string(),
    Income: yup.string(),
})

let arr = "";

export default class FamilyForm extends React.Component {
    reviews = [];
    state = {
        modalVisible: false,
        modaledit:false,
    };
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
    onPressForDelete(id) {
        alert("Deleted family details with name :"+id);
        for (var i = 0; i < this.reviews.length; i++) { if (this.reviews[i].Name === id) { this.reviews.splice(i, 1); } }
        //this.reviews = this.reviews.splice(id-1,1);
        this.setModalVisible(this.state.modalVisible)
        console.log(this.reviews);
    }
    render() {
        return (
            <View >

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
                                        Name: this.props.values.Name || '',
                                        Relation: '',
                                        Occupation: '',
                                        Age: '',
                                        Present: '',
                                        Remarks: '',
                                        Income: '',
                                    }
                                }
                                validationSchema={FamilyFormSchema}
                                onSubmit={(values, actions) => {
                                    actions.resetForm();
                                    console.log(values);
                                    this.reviews = this.reviews.concat(values);
                                    alert("Data Has been submitted");
                                    this.setModalVisible(!this.state.modalVisible);
                                    
                                    //this.setState(this.reviews.review.concat(values));
                                    console.log("final", this.reviews);
    
                                  
                                    this.reviews.map((v,i) => {
                                       // arr = v;

                                        console.log(".....id", i+1);
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
                                                    style={globalStyles.input}
                                                    onChangeText={props.handleChange('Name')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Name} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Relation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Relation && props.errors.Relation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Relation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={props.handleChange('Relation')}
                                                >
                                                    <Picker.Item label="Relation" value="" />
                                                    <Picker.Item label="Aunty" value="Aunty" />
                                                    <Picker.Item label="Brother" value="Brother" />
                                                    <Picker.Item label="Elder Brother" value="Elder Brother" />
                                                    <Picker.Item label="Elder sister" value="Elder sister" />
                                                    <Picker.Item label="Daughter" value="Daughter" />
                                                    <Picker.Item label="Cousin" value="Cousin" />
                                                    <Picker.Item label="Brother in Law" value="Brother in Law" />
                                                </Picker>
                                                <Text style={globalStyles.text}>Age</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Age && props.errors.Age}</Text>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    onChangeText={props.handleChange('Age')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Age} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Occupation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Occupation && props.errors.Occupation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Occupation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={props.handleChange('Occupation')}
                                                >
                                                    <Picker.Item label="Occupation" value="" />
                                                    <Picker.Item label="Abroad" value="Abroad" />
                                                    <Picker.Item label="Achari" value="Achari" />
                                                    <Picker.Item label="Actor" value="Actor" />
                                                    <Picker.Item label="Agriculture Labor" value="Agriculture Labor" />
                                                    <Picker.Item label="Artist" value="Artist" />
                                                    <Picker.Item label="Attender" value="Attender" />
                                                    <Picker.Item label="Any Other" value="Any Other" />
                                                    <Picker.Item label="Banker" value="Banker" />
                                                    <Picker.Item label="Barber" value="Barber" />
                                                </Picker>
                                                <Text style={globalStyles.text}>Present</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Present && props.errors.Present}</Text>
                                                <Picker
                                                    selectedValue={props.values.Present}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={props.handleChange('Present')}
                                                >
                                                    <Picker.Item label="Present" value="" />
                                                    <Picker.Item label="Alive" value="Alive" />
                                                    <Picker.Item label="Late" value="Late" />
                                                    <Picker.Item label="Married" value="Married" />
                                                    <Picker.Item label="Single" value="Single" />
                                                    <Picker.Item label="Divorced" value="Divorced" />
                                                </Picker>
                                                <Text style={globalStyles.text}>Income</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    onChangeText={props.handleChange('Income')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Income} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Remarks</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Remarks && props.errors.Remarks}</Text>
                                                <TextInput
                                                    style={globalStyles.input}
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
                <Modal visible={this.state.modaledit} animationType='slide'>
                    <View style={styles.modalContent}>
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
                                onSubmit={(values, actions) => {
                                    actions.resetForm();
                                    console.log(values);
                                    this.reviews = this.reviews.concat(values);
                                    alert("Data Has been submitted");
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
                                                    style={globalStyles.input}
                                                    onChangeText={props.handleChange('Name')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Name} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Relation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Relation && props.errors.Relation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Relation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={props.handleChange('Relation')}
                                                >
                                                    <Picker.Item label="Relation" value="" />
                                                    <Picker.Item label="Aunty" value="Aunty" />
                                                    <Picker.Item label="Brother" value="Brother" />
                                                    <Picker.Item label="Elder Brother" value="Elder Brother" />
                                                    <Picker.Item label="Elder sister" value="Elder sister" />
                                                    <Picker.Item label="Daughter" value="Daughter" />
                                                    <Picker.Item label="Cousin" value="Cousin" />
                                                    <Picker.Item label="Brother in Law" value="Brother in Law" />
                                                </Picker>
                                                <Text style={globalStyles.text}>Age</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Age && props.errors.Age}</Text>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    onChangeText={props.handleChange('Age')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Age} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Occupation</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Occupation && props.errors.Occupation}</Text>
                                                <Picker
                                                    selectedValue={props.values.Occupation}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={props.handleChange('Occupation')}
                                                >
                                                    <Picker.Item label="Occupation" value="" />
                                                    <Picker.Item label="Abroad" value="Abroad" />
                                                    <Picker.Item label="Achari" value="Achari" />
                                                    <Picker.Item label="Actor" value="Actor" />
                                                    <Picker.Item label="Agriculture Labor" value="Agriculture Labor" />
                                                    <Picker.Item label="Artist" value="Artist" />
                                                    <Picker.Item label="Attender" value="Attender" />
                                                    <Picker.Item label="Any Other" value="Any Other" />
                                                    <Picker.Item label="Banker" value="Banker" />
                                                    <Picker.Item label="Barber" value="Barber" />
                                                </Picker>
                                                <Text style={globalStyles.text}>Present</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Present && props.errors.Present}</Text>
                                                <Picker
                                                    selectedValue={props.values.Present}
                                                    style={globalStyles.dropDown}
                                                    onValueChange={props.handleChange('Present')}
                                                >
                                                    <Picker.Item label="Present" value="" />
                                                    <Picker.Item label="Alive" value="Alive" />
                                                    <Picker.Item label="Late" value="Late" />
                                                    <Picker.Item label="Married" value="Married" />
                                                    <Picker.Item label="Single" value="Single" />
                                                    <Picker.Item label="Divorced" value="Divorced" />
                                                </Picker>
                                                <Text style={globalStyles.text}>Income</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.PresentLocalAddress && props.errors.PresentLocalAddress}</Text>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    onChangeText={props.handleChange('Income')} //This will update the IdentificationMArk value in 'values'
                                                    value={props.values.Income} //value updated in 'values' is reflected here
                                                />
                                                <Text style={globalStyles.text}>Remarks</Text>
                                                <Text style={globalStyles.errormsg}>{props.touched.Remarks && props.errors.Remarks}</Text>
                                                <TextInput
                                                    style={globalStyles.input}
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
                <FlatList
                    data={this.reviews}
                    renderItem={({ item, index}) => (
                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                            <TouchableOpacity style={styles.container} >
                                {/*react-native-elements Card*/}
                                <Card>
                                    <CardContent style={styles.paragraph}>
                                        <Text>Name : {item.Name}</Text>
                                        <Text>Relation : {item.Relation}</Text>
                                        <Text>Age : {item.Age}</Text>
                                        <Text>Occupation : {item.Occupation}</Text>
                                        <Text>Present : {item.Present}</Text>
                                        <Text>Income : {item.Income}</Text>
                                        <Text>Remarks : {item.Remarks}</Text>
                 
                                    </CardContent>
                                    <MaterialIcons
                                        name='edit'
                                        size={18}
                                        style={styles.Icons}
                                        onPress={() => this.setModalVisible(true)}
                                    />
                                    <MaterialIcons
                                        name='delete'
                                        size={18}
                                        style={styles.Icons}
                                        onPress={() => this.onPressForDelete(item.Name)}
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
        padding: 20
    },
    container: {
        // width : 150,
        height: 200,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
        // borderRadius : 15,
        // backgroundColor : '#FFFFFF',
    }
});
