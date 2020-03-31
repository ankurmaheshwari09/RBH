import React from 'react';
import {Text, View} from 'react-native';

export default class InfoGeneral extends React.Component{

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
        );
    }

}