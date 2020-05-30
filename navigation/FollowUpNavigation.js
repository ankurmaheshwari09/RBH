import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import FollowUpScreen from '../screens/FollowUpScreen';

const screens = {
    FollowUpBy: {
        screen: FollowUpScreen,

    }
}

const FollowUpStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        title: 'Add Followups',
        headerStyle: {
            height: 50,
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(FollowUpStack)