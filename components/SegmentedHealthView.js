import React, { Component } from 'react';
import ChildMedicalTreatment from './ChildMedicalTreatment';
import ChildGrowthForm from './ChildGrowthForm';
import ChildHealthCheckList from './ChildHealthCheckList';
import HealtDuringAdd from './HealthDuringAddForm'
import {globalStyles} from '../styles/global';
import {base_url, getDataAsync} from '../constants/Base';
import {
  StyleSheet,
  Text,
  View,
  ScrollViewBase, ScrollView, TouchableOpacity, SafeAreaView, Image,
} from 'react-native';

export default class SegmentedHealthView extends Component {
constructor(props) {
    super(props);
    console.log(this.props.navigation.getParam('child').childNo);
    this.state = {
      customStyleIndex: 0,
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
      childData: []
    }
  }

    componentDidMount(){
      this.setState({ search: null, loading: true });
      getDataAsync(base_url + '/child/' + this.state.child.childNo).then(data => {this.setState({childData: data, formIndex: 0}); console.log(data)})
      getDataAsync(base_url + '/child-health-all-records/' + this.state.child.childNo).then(data => {
        if(JSON.stringify(data) !== JSON.stringify([]) && data !== null){
            let health = data[0];
            let required_date = new Date(health.healthDate)
            for(let i = 1; i < data.length ; i++)
            {
              if(data[i].healthDate == null)
                continue;
              let vardate = new Date(data[i].healthDate)
              if(vardate < required_date){
                health = data[i]
                required_date = new Date(health.healthDate)
              }
            }
            this.setState({childHealth: health})
          }
        })
      }

    async getData(){

    }
//  health_child_No;
//  health_child_No = this.props.navigation.getParam('child').childNo;

    render() {
      const {customStyleIndex } = this.state
              return (
                <View style = {globalStyles.container}>
                   <View style={globalStyles.backgroundlogoimageview}>
                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                   </View>
                  <View style = {globalStyles.segView}>
                  <ScrollView
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    style = {globalStyles.segScrollView}
                  >
                    <View>
                    <TouchableOpacity style = {{borderBottomWidth: this.state.customStyleIndex == 3 ? 3 : 0 ,borderBottomColor: this.state.customStyleIndex == 3 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({customStyleIndex : 3})}>
                         <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:20}}>Health During Addmission</Text>
                     </TouchableOpacity>
                      </View>
                    <View>
                      <TouchableOpacity style = {{borderBottomWidth: this.state.customStyleIndex == 0 ? 3 : 0 ,borderBottomColor: this.state.customStyleIndex == 0 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({customStyleIndex: 0})}>
                        <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:20}}>Child Growth Form</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style = {{borderBottomWidth: this.state.customStyleIndex == 1 ? 3 : 0 ,borderBottomColor: this.state.customStyleIndex == 1 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({customStyleIndex: 1})}>
                        <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:20}}>Child Medical Treatment</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                       <TouchableOpacity style = {{borderBottomWidth: this.state.customStyleIndex == 2 ? 3 : 0 ,borderBottomColor: this.state.customStyleIndex == 2 ? 'grey' : '#f0f0f0'}} onPress = {() => this.setState({customStyleIndex: 2})}>
                         <Text style = {{paddingLeft: 10, paddingRight: 20, paddingTop:20}}>Child Health CheckList</Text>
                       </TouchableOpacity>
                    </View>
                  </ScrollView>
                  </View>
                    {customStyleIndex === 3 && <HealtDuringAdd navigation = {this.props.navigation} childHealth = {this.state.childHealth} childData = {this.state.childData}/>}
                    {customStyleIndex === 0 && <ChildGrowthForm navigation = {this.props.navigation}/>}
                    {customStyleIndex === 1 && <ChildMedicalTreatment navigation = {this.props.navigation}/>}
                    {customStyleIndex === 2 && <ChildHealthCheckList navigation = {this.props.navigation}/>}
                </View>
       );
     }
   }