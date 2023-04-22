import { View, Alert } from "react-native";
import { styles } from "../styles/FrontpageStyle";
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { Chip } from "@rneui/themed";

export default function UserPage({ navigation }) {
    const signOutUser = async () => {
        await signOut(auth)
        console.log("Succesfully signed out")
        navigation.navigate("LoginPage")
        Alert.alert("Kirjautunut ulos", "Olet kirjautunut ulos")
    }
    return (
        <View style={styles.container}>
            <Chip
                title="Kirjaudu ulos"
                size="lg"
                type="solid"
                color="#414141"
                onPress={() => {
                    Alert.alert(
                        "Varoitus",
                        "Haluatko kirjautua ulos?",
                        [
                            { text: "Ei", style: "cancel" }, {
                                text: "Kyllä",
                                onPress: () =>
                                    signOutUser(),
                                style: "destructive",
                            },
                        ],
                        { cancelable: true }
                    )
                }}
                icon={{
                    name: "exit-outline",
                    color: "white",
                    type: "ionicon"
                }}
            />
        </View>
    )
}