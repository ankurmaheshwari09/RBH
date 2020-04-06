import React, {Component} from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/global';

export default class ProfileDisplay extends Component{

    render(){
        return(
            <View style={globalStyles.container}>
             <Text>{this.props.navigation.getParam('Description')}</Text>
            </View>
        );
    }
}