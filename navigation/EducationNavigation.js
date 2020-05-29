import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import EducationScreen from '../screens/EducationScreen';

const screens = {
    ChildEducation: {
        screen: EducationScreen,

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