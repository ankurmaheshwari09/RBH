import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import SegmentedHealthView from '../components/SegmentedHealthView'
import HealthScreen from '../screens/HealthScreen';
//import GeneralInfoSegControl from '../components/GeneralInfoSegControl'
//import InfoGeneral from '../screens/InfoGeneral';

const screens = {
    Modify: {
        screen: SegmentedHealthView
    },
    HealthScreen: {
        screen: HealthScreen
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