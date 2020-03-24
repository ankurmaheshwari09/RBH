import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { React } from 'react';
import CommitteeDisplay from '../screens/CommitteeDisplay';
import CommitteeScreen from '../screens/CommitteeScreen';

const screens = {
    CommitteeDisplay: {
        screen: CommitteeDisplay
    },
    CommitteeScreen: {
        screen: CommitteeScreen
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerStyle: {
            height: 50
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(HomeStack)