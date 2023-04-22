import { Chip, Input, Text } from '@rneui/themed';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { View, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { styles } from '../styles/LoginStyle';

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setEmail("")
            setPassword("")
            console.log("Succesfully logged in")
            navigation.navigate("TabNavi")
        } catch (error) {
            Alert.alert("Virhe", "Virheellinen sähköposti tai salasana")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Tervetuloa FitnessAppiin!</Text>
            <Text style={styles.loginText}>Kirjaudu sisään tai rekisteröidy</Text>
            <View style={styles.innerContainer}>
                <Input
                    style={styles.input}
                    placeholder="Sähköposti"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(t) => {
                        setEmail(t)
                    }}
                />
                <Input
                    style={styles.input}
                    placeholder="Salasana"
                    autoCapitalize="none"
                    value={password}
                    onChangeText={(t) => {
                        setPassword(t)
                    }}
                    secureTextEntry={true}
                />
            </View>
            <View>
                <Chip
                    title="Kirjaudu sisään"
                    onPress={() => {
                        handleLogin()
                    }}
                    size="lg"
                    type="solid"
                    color="orange"
                    icon={{
                        name: "person",
                        color: "white",
                        type: "ionicon"
                    }}
                />
                <View style={{ height: 20 }}></View>
                <Chip
                    title="Rekisteröidy"
                    onPress={() => {
                        navigation.navigate("RegistrationPage")
                    }}
                    size="lg"
                    type="solid"
                    color="#414141"
                    icon={{
                        name: "person-add",
                        color: "white",
                        type: "ionicon"
                    }}
                />
            </View>
        </View>
    )
}