import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
//           <SegmentedHealthView navigation = {this.props.navigation}/>
import SegmentedHealthView from '../components/SegmentedHealthView';
export default class HealthScreen extends Component {
    render() {
        return (

              <View>
                          <Text>{this.props.navigation.getParam('identificationPlace1')}</Text>
                          <Text>{this.props.navigation.getParam('markType1')}</Text>
                          <Text>{this.props.navigation.getParam('identificationPlace2')}</Text>
                          <Text>{this.props.navigation.getParam('markType2')}</Text>
                          <Text>{this.props.navigation.getParam('specialNeed')}</Text>
                           <Text>{this.props.navigation.getParam('durationOnStreet')}</Text>
                          <Text>{this.props.navigation.getParam('psoName')}</Text>
                          <Text>{this.props.navigation.getParam('cwcRefNo')}</Text>
                          <Text>{this.props.navigation.getParam('cwcStayReason')}</Text>

                          <Text>{this.props.navigation.getParam('dropOutReason')}</Text>
                          <Text>{this.props.navigation.getParam('yearOfStudied')}</Text>
                          <Text>{this.props.navigation.getParam('medium')}</Text>
                          <Text>{this.props.navigation.getParam('schoolName')}</Text>
                          <Text>{this.props.navigation.getParam('class')}</Text>
                          <Text>{this.props.navigation.getParam('schoolPlace')}</Text>

                          <Text>{this.props.navigation.getParam('bloodGroup')}</Text>
                          <Text>{this.props.navigation.getParam('generalHealth')}</Text>
                          <Text>{this.props.navigation.getParam('height')}</Text>
                          <Text>{this.props.navigation.getParam('weight')}</Text>
                          <Text>{this.props.navigation.getParam('comments')}</Text>

               </View>
        )
    }
}
