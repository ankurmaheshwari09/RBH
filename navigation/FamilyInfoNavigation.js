import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import FamilyForm from '../components/FamilyForm';


const screens = {
    FamilyForm: {
        screen: FamilyForm
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        title: 'Family Details',
        headerStyle: {
            height: 50
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(HomeStack)
