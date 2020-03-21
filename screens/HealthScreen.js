import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import SegmentedHealthView from '../components/SegmentedHealthView';
export default class HealthScreen extends Component {
    render() {
        return (
           <SegmentedHealthView/>
        )
    }
}
