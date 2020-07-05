import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import EducationScreen from '../components/EducationSegInfo';

const screens = {
    ChildEducation: {
        screen: EducationScreen,

    }
}

const StatusStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        title: 'Child Education',
        headerStyle: {
            height: 50,
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(StatusStack)