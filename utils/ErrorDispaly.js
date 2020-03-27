import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { View, Text } from 'react-native';

export function ErrorDisplay(props) {
    if (props.errorDisplay) {
        return (
            <View>
               <Text>Something went wrong!!</Text>
            </View>);
    }
    else {
        return null;
    }
}