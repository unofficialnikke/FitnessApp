import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Frontpage from './Frontpage';
import NewTraining from './NewTraining'
import TabNavi from './TabNavi';
import ShowTrainings from './ShowTrainings';
import NewActivity from './NewActivity';
import ShowActivities from './ShowActivities';
import LoginPage from './LoginPage';
import RegistrationPage from './RegigstrationPage';
import EditTrainingList from './EditTrainingList';

const Stack = createStackNavigator();

export default function StackNavi() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginPage">
                <Stack.Screen name="TabNavi" component={TabNavi} options={{ headerShown: false }} />
                <Stack.Screen name="Frontpage" component={Frontpage} />
                <Stack.Screen name="NewTraining" component={NewTraining} options={{
                    title: "Uusi harjoitus",
                    headerStyle: { backgroundColor: "orange" },
                    headerTitleStyle: { color: "white" }
                }} />
                <Stack.Screen name="ShowTrainings" component={ShowTrainings} options={{
                    title: "Harjoitukset",
                    headerStyle: { backgroundColor: "orange" },
                    headerTitleStyle: { color: "white" }
                }} />
                <Stack.Screen name="NewActivity" component={NewActivity} options={{
                    title: "Harjoitus kalenteriin",
                    headerStyle: { backgroundColor: "orange" },
                    headerTitleStyle: { color: "white" }
                }} />
                <Stack.Screen name="ShowActivities" component={ShowActivities} options={{
                    title: "Kalenterin harjoitukset",
                    headerStyle: { backgroundColor: "orange" },
                    headerTitleStyle: { color: "white" }
                }} />
                <Stack.Screen name="LoginPage" component={LoginPage} options={{
                    title: "Kirjautuminen",
                    headerStyle: { backgroundColor: "orange" },
                    headerTitleStyle: { color: "white" },
                    headerTitleAlign: "center"
                }} />
                <Stack.Screen name="RegistrationPage" component={RegistrationPage} options={{
                    title: "Rekisteröityminen",
                    headerStyle: { backgroundColor: "orange" },
                    headerTitleStyle: { color: "white" },
                    headerTitleAlign: "center"
                }} />
                <Stack.Screen name="EditTrainingList" component={EditTrainingList} options={{
                    title: "Muokkaa harjoitusta",
                    headerStyle: { backgroundColor: "orange" },
                    headerTitleStyle: { color: "white" },
                    headerTitleAlign: "center"
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}