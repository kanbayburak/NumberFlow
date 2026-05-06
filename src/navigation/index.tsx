import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SplashScreen,
  HomeScreen,
  DifficultyScreen,
  LevelSelectionScreen,
  GameScreen,
  ResultScreen,
  SettingsScreen,
} from '../screens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Difficulty" component={DifficultyScreen} />
      <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
