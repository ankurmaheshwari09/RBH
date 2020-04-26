import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';

export default class SideBar extends Component {

    render () {
        return (
            <ScrollView>
                <ImageBackground
                    source = {require("../assets/background.png")}
                    style = {{ width: undefined, padding: 16, paddingTop: 48 }}
                >
                    <Text style={styles.text}>Rainbow Homes</Text>
                    <Text style={styles.text}>Bachupally</Text>
                    <Text style={styles.text}>Home Id - 12 </Text>
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