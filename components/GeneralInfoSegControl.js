import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollViewBase, ScrollView, TouchableOpacity, SafeAreaView, Image
} from 'react-native'
import GeneralInfoForm from './GeneralInfoForm';
import HealtDuringAdd from './HealthDuringAddForm'
import PrevEduForm from './PrevEduForm';
import EditChild from './EditChildForm';
import { globalStyles } from '../styles/global';
import {base_url, getDataAsync} from '../constants/Base';
import {LoadingDisplay} from '../utils/LoadingDisplay';

export default class GeneralInfoSegControl extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    formIndex: -1,
    loading: false,
    child: this.props.navigation.getParam('child'),
    childHealth: {
      "bloodGroup": '',
      "generalHealth": '',
      "height": '',
      "weight": '',
      "comments": '',
      "newChild": true
    },
    prevEducation: {
      "dropoutReason": '',
      "date_to": '',
      "yearOfStudied": '',
      "medium": '',
      "schoolName": '',
      "schooltype": '',
      "studyingclass": '',
      "address": '',
      "newChild": true
    },
    childData: []
  }

    componentDidMount(){
      this.setState({ search: null, loading: true });
      getDataAsync(base_url + '/child/' + this.state.child.childNo).then(data => {this.setState({childData: data, formIndex: 0}); console.log(data);this.setState({loading: false})})
    }
        
    render() {
      const {formIndex} = this.state
      return (
        <View style = {globalStyles.container}>
          <View style={globalStyles.backgroundlogoimageview}>
            <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
          </View>
          <LoadingDisplay loading={this.state.loading} />
          <View style = {globalStyles.segView}>
          <ScrollView
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            style = {globalStyles.segScrollView}
          >
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 0 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 0 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 0})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>General Info.</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 1 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 1 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 1})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>Child Addmission</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
            </View>
            <View style = {globalStyles.scrollContainer}>
              {formIndex === 0 && <GeneralInfoForm navigation = {this.props.navigation} childData = {this.state.childData}/>}
              {formIndex === 1 && <EditChild navigation = {this.props.navigation} childData = {this.state.childData}/>}
            </View>
        </View>
      )
    }
}