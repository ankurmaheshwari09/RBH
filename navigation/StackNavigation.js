import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'

import EducationScreen from './EducationNavigation';
import ChildList from '../components/ChildList';
import ViewProfile from '../components/ViewProfile';
import GeneralInfoStack from './GeneralInfoNavigation';
import CommitteeSuggestionNavigation from './CommitteeSuggestionNavigation';
import StatusNavigator from './StatusNavigator';
import FollowUpNavigation from './FollowUpNavigation';
import FamilyInfoNavigation from './FamilyInfoNavigation';
import CommunicationInfoNavigation from './CommunicationInfoNavigation';
import childResultScreen from './ChildResultNavigation';
import HealthInfoNavigation from './HealthInfoNavigation';

const screens = {
    ViewChild: {
        screen: ChildList,
    },
    Education: {
        screen: EducationScreen
    },
    Status: {
        screen: StatusNavigator
    },
    Health: {
        screen: HealthInfoNavigation
    },
    GeneralInfo: {
        screen: GeneralInfoStack
    },
    Profile: {
        screen: ProfileNav
    },
    Family: {
        screen: FamilyInfoNavigation
    },
    Communication: {
        screen: CommunicationInfoNavigation
    },
    Committee: {
        screen: CommitteeSuggestionNavigation
    },
    FollowUp: {
        screen: FollowUpNavigation
    },
    ChildResult: {
        screen: childResultScreen,
    },

};


const HomeStack = createStackNavigator(screens, { headerMode: 'none' });

export default createAppContainer(HomeStack)
