import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/global';

export default class FamilyScreen extends React.Component {

    render() {
        return (
            <View style={globalStyles.container}>

                <Text>{this.props.navigation.getParam('Name')}</Text>
                <Text>{this.props.navigation.getParam('Relation')}</Text>
                <Text>{this.props.navigation.getParam('Occupation')}</Text>
                <Text>{this.props.navigation.getParam('Age')}</Text>
                <Text>{this.props.navigation.getParam('Present')}</Text>
                <Text>{this.props.navigation.getParam('Remarks')}</Text>
                <Text>{this.props.navigation.getParam('Income')}</Text>
            </View>
        );
    }

}
