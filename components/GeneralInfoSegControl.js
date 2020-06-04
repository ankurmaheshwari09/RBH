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
      getDataAsync(base_url + '/child/' + this.state.child.childNo).then(data => this.setState({childData: data}))
      getDataAsync(base_url + '/child-health-all-records/' + this.state.child.childNo).then(data => {
        if(JSON.stringify(data) !== JSON.stringify([]) && data !== null){
            let health = data[0];
            let required_date = new Date(health.healthDate)
            for(let i = 1; i < data.length ; i++)
            {
              let vardate = new Date(data[i].healthDate)
              if(vardate < required_date){
                health = data[i]
                required_date = new Date(health.healthDate)
              }
            }
            this.setState({childHealth: health})
          }
        })
      getDataAsync(base_url + '/child-education/' + this.state.child.childNo).then(data => {
        if(data !== null && JSON.stringify(data) !== JSON.stringify([]))
          this.setState({prevEducation: data[0]})
        this.setState({loading: false})
      })
    }
    async getData(){
      
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
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 2 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 2 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 2})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>Previous Education</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 3 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 3 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 3})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>Health During Addmission</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
            </View>
            <View style = {globalStyles.scrollContainer}>
              {formIndex === 0 && <GeneralInfoForm navigation = {this.props.navigation} childData = {this.state.childData}/>}
              {formIndex === 1 && <EditChild navigation = {this.props.navigation} childData = {this.state.childData}/>}
              {formIndex === 2 && <PrevEduForm navigation = {this.props.navigation} prevEducation = {this.state.prevEducation}/>}
              {formIndex === 3 && <HealtDuringAdd navigation = {this.props.navigation} childHealth = {this.state.childHealth}/>}
            </View>
        </View>
      )
    }
}