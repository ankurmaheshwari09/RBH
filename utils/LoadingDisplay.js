import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { View } from 'react-native';
import { globalStyles } from '../styles/global';
import { ActivityIndicator } from 'react-native';


export function LoadingDisplay(props) {
    if (props.loading) {
        return (
            <View>
                <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={props.loading}
                    //Text with the Spinner 
                    textContent={'Loading...'}
                //textStyle={globalStyles.spinnerTextStyle}
                />
            </View>);
    }
    else {
        return null;
    }
}
