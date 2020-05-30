import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { React } from 'react';
//import CommitteeDisplay from '../screens/CommitteeDisplay';
import CommitteeSuggestionForm from '../components/CommitteeSuggestionForm';

const screens = {
    'CommitteeSuggestion': {
        screen: CommitteeSuggestionForm
    },
}

const CommitteeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerStyle: {
            height: 50
        },
        safeAreaInsets: { top: 0 }
    }
})

export default createAppContainer(CommitteeStack)