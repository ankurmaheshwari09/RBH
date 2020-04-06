
import React, { Component } from 'react';
import ChildMedicalTreatment from './ChildMedicalTreatment';
import ChildGrowthForm from './ChildGrowthForm';
import ChildHealthCheckList from './ChildHealthCheckList';
import {globalStyles} from '../styles/global';
import {
  StyleSheet,
  Text,
  View,
  ScrollViewBase, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';

export default class SegmentedHealthView extends Component {
constructor(props) {
    super(props);
    console.log(this.props.navigation.getParam('child').childNo);
    this.state = {
      customStyleIndex: 0
    }
  }
//  health_child_No;
//  health_child_No = this.props.navigation.getParam('child').childNo;

    handleCustomIndexSelect = (index) => {
      this.setState(prevState => ({ ...prevState, customStyleIndex: index }))
    }

    render() {
      const {customStyleIndex } = this.state
              return (
                <View style = {globalStyles.container}>
                  <View style = {{height: 50}}>
                  <ScrollView
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    style = {{height:10}}
                  >
                    <View>
                      <TouchableOpacity style = {{borderBottomWidth: this.state.customStyleIndex == 0 ? 3 : 0 ,borderBottomColor: this.state.customStyleIndex == 0 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({customStyleIndex: 0})}>
                        <Text style = {{fontSize:20, paddingLeft: 10, paddingRight: 20, paddingTop:20}}>ChildGrowthForm</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style = {{borderBottomWidth: this.state.customStyleIndex == 1 ? 3 : 0 ,borderBottomColor: this.state.customStyleIndex == 1 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({customStyleIndex: 1})}>
                        <Text style = {{fontSize:20, paddingLeft: 10, paddingRight: 20, paddingTop:20}}>ChildMedicalTreatment</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                       <TouchableOpacity style = {{borderBottomWidth: this.state.customStyleIndex == 2 ? 3 : 0 ,borderBottomColor: this.state.customStyleIndex == 2 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({customStyleIndex: 2})}>
                         <Text style = {{fontSize:20, paddingLeft: 10, paddingRight: 20, paddingTop:20}}>ChildHealthCheckList</Text>
                       </TouchableOpacity>
                    </View>
                  </ScrollView>
                  </View>
                    {customStyleIndex === 0 && <ChildGrowthForm navigation = {this.props.navigation}/>}
                    {customStyleIndex === 1 && <ChildMedicalTreatment navigation = {this.props.navigation}/>}
                    {customStyleIndex === 2 && <ChildHealthCheckList navigation = {this.props.navigation}/>}
                </View>
       );
     }
   }