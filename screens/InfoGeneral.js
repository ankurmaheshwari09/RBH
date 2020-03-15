import React from 'react';
import {Text, View} from 'react-native';

export default class InfoGeneral extends React.Component{

    render() {
        return (
        <View>
            <Text>{this.props.navigation.getParam('IdentificationPlace1')}</Text>
            <Text>{this.props.navigation.getParam('MarkType1')}</Text>
            <Text>{this.props.navigation.getParam('IdentificationPlace2')}</Text>
            <Text>{this.props.navigation.getParam('MarkType2')}</Text> 
            <Text>{this.props.navigation.getParam('SpecialNeed')}</Text>
             <Text>{this.props.navigation.getParam('DurationOnStreet')}</Text>
            <Text>{this.props.navigation.getParam('PSOName')}</Text>            
            <Text>{this.props.navigation.getParam('CWCRefNo')}</Text>

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