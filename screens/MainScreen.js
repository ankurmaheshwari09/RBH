import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AppNavigator from '../navigation/AppNavigator';


export default class MainScreen extends Component {

    render () {
        return (
            <View style={styles.container}>
                <View>
                    <CustomHeader navigation={this.props.navigation} title="Rainbow Homes"/>
                </View>

                <AppNavigator />


            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 15,
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
});
