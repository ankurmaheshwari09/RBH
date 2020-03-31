import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/global';

export default class CommunicationScreen extends React.Component {

    render() {
        return (
            <View style={globalStyles.container}>

                <Text>{this.props.navigation.getParam('PresentLocalAddress')}</Text>
                <Text>{this.props.navigation.getParam('Area')}</Text>
                <Text>{this.props.navigation.getParam('Pincode')}</Text>
                <Text>{this.props.navigation.getParam('Mobile')}</Text>
                <Text>{this.props.navigation.getParam('Phone')}</Text>
                <Text>{this.props.navigation.getParam('PermanentAddress')}</Text>
                <Text>{this.props.navigation.getParam('Country')}</Text>
                <Text>{this.props.navigation.getParam('State')}</Text>
                <Text>{this.props.navigation.getParam('District')}</Text>


            </View>
        );
    }

}
