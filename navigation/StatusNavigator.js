import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import { React } from 'react';
import StatusScreen from '../screens/StatusScreen';
import StatusSegControl from '../components/StatusSegControl';

const screens = {
    ChildStatus: {
        screen: StatusSegControl,
        
    }
}

const StatusStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        title: 'Modify Status/Add Followups',
        headerStyle: {
            height: 50,
           
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(StatusStack)