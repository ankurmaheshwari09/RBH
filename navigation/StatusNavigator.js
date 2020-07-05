import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import StatusScreen from '../screens/StatusScreen';

const screens = {
    ChildStatus: {
        screen: StatusScreen,
        
    }
}

const StatusStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        title: 'Modify Status',
        headerStyle: {
            height: 50,         
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(StatusStack)