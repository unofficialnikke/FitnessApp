import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import TrainingCalendar from './TrainingCalendar';
import Frontpage from './Frontpage';
import Trainings from './Trainings';
import { View } from 'react-native';
import { styles } from '../styles/FrontpageStyle';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Frontpage navigation={navigation} />
        </View>
    );
}

function CalendarScreen() {
    return (
        <View style={styles.container}>
            <TrainingCalendar />
        </View>
    );
}

function TrainingsScreen() {
    return (
        <View style={styles.container}>
            <Trainings />
        </View >
    );
}

const Tab = createBottomTabNavigator();

export default function TabNavi() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'add-outline';

                    if (route.name === 'Etusivu') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Kalenteri') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else {
                        iconName = focused ? 'barbell' : 'barbell-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "orange",
                tabBarInactiveTintColor: "white",
                tabBarInactiveBackgroundColor: "#414141",
                tabBarActiveBackgroundColor: "#414141",
                headerTitleAlign: "center"
            })}
        >
            <Tab.Screen name="Etusivu" component={HomeScreen} options={{
                headerStyle: { backgroundColor: "orange" },
                headerTitleStyle: { color: "white" },
            }}
            />
            <Tab.Screen name="Kalenteri" component={CalendarScreen} options={{
                headerStyle: { backgroundColor: "orange" },
                headerTitleStyle: { color: "white" }
            }}
            />
            <Tab.Screen name="Harjoitukset" component={TrainingsScreen} options={{
                headerStyle: { backgroundColor: "orange" },
                headerTitleStyle: { color: "white" }
            }}
            />
        </Tab.Navigator>
    )
}