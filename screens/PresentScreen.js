import React, { Component } from 'react';
import { Text } from 'react-native';
import HomeScreen from './HomeScreen';
import ChildList from "../components/ChildList";
import Test from "../components/Test";
import StackNavigation from '../navigation/StackNavigation';
import AddChild from '../components/AddChildForm'
import AddChildNavigation from '../navigation/AddChildNavigation';

export default class PresentScreen extends Component {

    render() {
        if (this.props.screen === 'home') {
            return <HomeScreen navigation={this.props.navigation} />;
        }
        else if (this.props.screen === 'addChild') {
            return <AddChild navigation={this.props.navigation} />;
        }
        else if (this.props.screen === 'viewChild') {
            return <StackNavigation screenProps={this.props.navigation} />;
        }
        else if (this.props.screen === 'report') {
            return <Text>Report Screen</Text>;
        }
    }
}

