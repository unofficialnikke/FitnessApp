import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Frontpage from './Frontpage';
import NewTraining from './NewTraining'
import TabNavi from './TabNavi';
import ShowTrainings from './ShowTrainings';

const Stack = createStackNavigator();

export default function StackNavi() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="TabNavi" component={TabNavi} options={{ headerShown: false }} />
                <Stack.Screen name="Frontpage" component={Frontpage} />
                <Stack.Screen name="NewTraining" component={NewTraining} options={{ title: "Uusi harjoitus" }} />
                <Stack.Screen name="ShowTrainings" component={ShowTrainings} options={{ title: "Harjoitukset" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}