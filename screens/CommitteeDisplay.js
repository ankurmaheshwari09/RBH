import React, {Component} from 'react';
import { Text, View } from 'react-native';

export default class CommitteeDisplay extends Component{

    render(){
        return(
            <View style={{flex:1, marginLeft:5, paddingTop:5}}>
            <Text>{this.props.navigation.getParam('text')}</Text>
            <Text>{this.props.navigation.getParam('date')}</Text>
            </View>
        )
    }
}