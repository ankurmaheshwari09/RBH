import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import ResultScreen from '../screens/ChildResultScreen';

const screens = {
    ChildResult: {
        screen: ResultScreen,

    }
}

const StatusStack = createStackNavigator(screens, {
    defaultNavigationOptions: {

        headerStyle: {
            height: 50,
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(StatusStack)