import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import SegmentedHealthView from '../components/SegmentedHealthView'
import HealthScreen from '../screens/HealthScreen';
//import GeneralInfoSegControl from '../components/GeneralInfoSegControl'
//import InfoGeneral from '../screens/InfoGeneral';

const screens = {
    ChildHealth: {
        screen: SegmentedHealthView
    },
    HealthScreen: {
        screen: HealthScreen
    },
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
      title: 'Child Health',
      headerStyle: {
        height: 50
      },
      safeAreaInsets: { top: 0 }
    }
  })

export default createAppContainer(HomeStack)