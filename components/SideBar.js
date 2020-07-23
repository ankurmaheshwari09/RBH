import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import { getOrgId, getHomeCode, getUserName } from '../constants/LoginConstant'

export default class SideBar extends Component {

    state = {
        orgId: '',
        homeCode: '',
    }

    componentDidMount() {
        let orgnumber = getOrgId();
        this.setState({orgId: orgnumber});
        let homecode = getHomeCode();
        this.setState({homeCode: homecode});
        console.log(this.state.homeCode);
    }

    render () {
        return (
            <ScrollView>
                <ImageBackground
                    source = {require("../assets/black.png")}
                    style = {{ width: undefined, padding: 16, paddingTop: 48 }}
                >
                    <Text style={styles.text}>Rainbow Online Reporting</Text>
                    <Text style={styles.text}>Home Code - {getHomeCode()} </Text>
                    <Text style={styles.text}>{getUserName()}</Text>
                </ImageBackground>
                <View>
                    <DrawerNavigatorItems {...this.props} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: '800',
    }
});