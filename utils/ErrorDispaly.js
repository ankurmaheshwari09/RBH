import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { View, StyleSheet,Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';


export function ErrorDisplay(props) {
    if (props.errorDisplay) {
        return (
            <View style={styles.container}>
                <Ionicons name="md-warning" size={60} color="red" />
                <Text style={globalStyles.text}>Something went wrong!</Text>
            </View>);
    }
    else {
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        top: 50
    }
});