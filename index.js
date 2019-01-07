/** @format */

console.disableYellowBox = true;
import { AppRegistry } from 'react-native';
import HomeScreen from './HomeScreen';
import WordsScreen from './WordsScreen';
import { name as appName } from './app.json';
import { createStackNavigator, createAppContainer } from 'react-navigation';
const App = createStackNavigator(
    {
        Home: { screen: HomeScreen },
        Words: { screen: WordsScreen },
    },
    {
        headerMode: "none"
    });

const Container = createAppContainer(App);

AppRegistry.registerComponent(appName, () => Container);
