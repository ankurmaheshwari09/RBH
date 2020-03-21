import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import FamilyForm from '../components/FamilyForm';
import FamilyScreen from '../screens/FamilyScreen';

const screens = {
    FamilyForm: {
        screen: FamilyForm
    },
    FamilyScreen: {
        screen: FamilyScreen
    },
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
