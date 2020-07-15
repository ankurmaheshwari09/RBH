import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import PresentScreen from './PresentScreen';
import CustomHeader from '../components/CustomHeader';
import ChildList from "../components/ChildList";


export default class Screen extends Component {

    render () {
        return (
            <View style={styles.container}>
                <View>
                    <CustomHeader title="Rainbow Homes Program" navigation={this.props.navigation}/>
                </View>
                    <PresentScreen screen={this.props.screen} navigation={this.props.navigation}/>


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
