import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { View } from 'react-native';
import { globalStyles } from '../styles/global';
import { ActivityIndicator } from 'react-native';


export function LoadingDisplay  (props)  {
    if (props.loading) {
        return (
            <View style={{ position: 'absolute', top: "45%", right: 0, left: 0, zIndex: 10}}>
                <ActivityIndicator animating={props.loading} size="large" color="red" />
            </View>);
    }
    else {
        return null;
    }
}