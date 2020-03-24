import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { React } from 'react';
import ProfileDisplay from '../screens/ProfileDisplay';
import ViewProfile from '../screens/ViewProfile';

const screens = {
    ProfileDisplay: {
        screen: ProfileDisplay
    },
    ViewProfile: {
        screen: ViewProfile
    },
    initialRouteName: 'ViewProfile',
}

const ProfileStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerStyle: {
            height: 50
        },
        safeAreaInsets: { top: 0 }
    }
    
})

export default createAppContainer(ProfileStack)