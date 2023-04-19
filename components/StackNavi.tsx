import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Frontpage from './Frontpage';
import NewTraining from './NewTraining'
import TabNavi from './TabNavi';
import ShowTrainings from './ShowTrainings';
import NewActivity from './NewActivity';
import ShowActivities from './ShowActivities';

const Stack = createStackNavigator();

export default function StackNavi() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="TabNavi" component={TabNavi} options={{ headerShown: false }} />
                <Stack.Screen name="Frontpage" component={Frontpage} />
                <Stack.Screen name="NewTraining" component={NewTraining} options={{ title: "Uusi harjoitus", headerStyle: { backgroundColor: "orange" }, headerTitleStyle: { color: "white" } }} />
                <Stack.Screen name="ShowTrainings" component={ShowTrainings} options={{ title: "Harjoitukset", headerStyle: { backgroundColor: "orange" }, headerTitleStyle: { color: "white" } }} />
                <Stack.Screen name="NewActivity" component={NewActivity} options={{ title: "Uusi aktiviteetti", headerStyle: { backgroundColor: "orange" }, headerTitleStyle: { color: "white" } }} />
                <Stack.Screen name="ShowActivities" component={ShowActivities} options={{ title: "Aktiviteetit", headerStyle: { backgroundColor: "orange" }, headerTitleStyle: { color: "white" } }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}