import  React, { Component } from 'react';
import { View, Text,StyleSheet, SafeAreaView, TouchableOpacity,Alert, Button } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import { logOut } from '../constants/LoginConstant';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 90,
        paddingTop: 35,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18,
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        alignItems: 'flex-start', 
        margin: 16,
        flex: 2,
    },
    logout: {
        paddingRight: 20,
    }
});

export default class CustomHeader extends Component {

    Logout() {
        Alert.alert(
            "Confirm",
            "Are you sure you want to logout?",
            [
                { text: 'OK', onPress: () => logOut() },
            ],
            { cancelable: true },
        );
    }

    render () {
        return (
                <View style={styles.header}>
                    <TouchableOpacity
                        style = {styles.menuIcon}
                        onPress={this.props.navigation.openDrawer}>
                        <FontAwesome5 name="bars" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{this.props.title}</Text>
                        <TouchableOpacity onPress={this.Logout} >
                            <View style={styles.logout}>
                                <Feather name="power" size={20} color={"white"}/>
                            </View>
                        </TouchableOpacity>
                </View>
        );
    }
}