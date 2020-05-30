import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import CommitteeSuggestionForm from '../components/CommitteeSuggestionForm';

const screens = {
    "Committee Suggestions": {
        screen: CommitteeSuggestionForm
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