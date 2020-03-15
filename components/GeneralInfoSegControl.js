/* @flow */
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollViewBase, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native'
import GeneralInfoForm from './GeneralInfoForm';
import HealtDuringAdd from './HealthDuringAddForm'
import PrevEduForm from './PrevEduForm';
import { globalStyles } from '../styles/global';

export default class GeneralInfoSegControl extends Component {
  constructor() {
    super()
    this.state = {
      formIndex: 0
    }
  }

    render() {
      const {formIndex} = this.state
      return (
        <View style = {globalStyles.container}>
          <View style = {globalStyles.segView}>
          <ScrollView
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            style = {globalStyles.segScrollView}
          >
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 0 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 0 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 0})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>GeneralInfo</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 1 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 1 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 1})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>PrevEdu</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 2 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 2 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 2})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>Health during addmission</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style = {{borderBottomWidth: this.state.formIndex == 3 ? 3 : 0 ,borderBottomColor: this.state.formIndex == 3 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({formIndex : 3})}>
                <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:10}}>Child Addmission</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
            </View>
            <View style = {globalStyles.scrollContainer}>
              {formIndex === 0 && <GeneralInfoForm navigation = {this.props.navigation}/>}
              {formIndex === 1 && <PrevEduForm navigation = {this.props.navigation}/>}
              {formIndex === 2 && <HealtDuringAdd navigation = {this.props.navigation}/>}
              {formIndex === 3 && <Text>Child Addmission Form goes here</Text>}
            </View>
        </View>
      )
    }
}