import React from 'react';
import {Text, View, Image} from 'react-native';
import {globalStyles} from '../styles/global';

export default class InfoAddChild extends React.Component{

    loadingimage () {
        console.log("loading Image");
    }

    render() {
        let photo = this.props.navigation.getParam('ChildPhoto');
        return (
        <View style = {globalStyles.container}>
            
            <Text>{this.props.navigation.getParam('ChildID')}</Text>
            <Text>{this.props.navigation.getParam('FirstName')}</Text>
            <Text>{this.props.navigation.getParam('LastName')}</Text>
            {/* <Text>{this.props.navigation.getParam('Community')}</Text> */}
            {/* <Text>{this.props.navigation.getParam('DOB')}</Text> */}
            <Text>{this.props.navigation.getParam('Gender')}</Text>
            <Text>{this.props.navigation.getParam('Religion')}</Text>
            <Text>{this.props.navigation.getParam('DOB')}</Text>
            <Image source={{ uri : photo }} onLoad={() => this.loadingimage} style={{ width: 200, height: 200 }} />

        </View>
        );
    }

}