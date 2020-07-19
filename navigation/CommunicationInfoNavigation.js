import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import CommunicationForm from '../components/CommunicationForm';
import CommunicationScreen from '../screens/CommunicationScreen';

const screens = {
    CommunicationForm: {
        screen: CommunicationForm
    },
    CommunicationScreen: {
        screen: CommunicationScreen
    },
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        title: 'Child Communication',
        headerStyle: {
            height: 50
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(HomeStack)
