import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { React } from 'react';
import CommitteeDisplay from '../screens/CommitteeDisplay';
import CommitteeSuggestionForm from '../components/CommitteeSuggestionForm';

const screens = {
    CommitteeScreen: {
        screen: CommitteeSuggestionForm
    },
    CommitteeDisplay: {
        screen: CommitteeDisplay
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