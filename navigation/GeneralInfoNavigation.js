import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import GeneralInfoSegControl from '../components/GeneralInfoSegControl'

const screens = {
    Modify: {
        screen: GeneralInfoSegControl
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