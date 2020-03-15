import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import GeneralInfoSegControl from '../components/GeneralInfoSegControl'
import InfoGeneral from '../screens/InfoGeneral';

const screens = {
    Modify: {
        screen: GeneralInfoSegControl
    },
    InfoGeneral: {
        screen: InfoGeneral
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