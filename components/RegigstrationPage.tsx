import { Chip, Input, Text } from '@rneui/themed';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { styles } from '../styles/LoginStyle';
import emailValidator from 'email-validator';

export default function RegistrationPage({ navigation }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfrim] = useState("")

    const handleCreateUser = async () => {
        if (password !== passwordConfirm) {
            Alert.alert("Virhe", "Salasanat eivät täsmää")
            return
        }
        else if (password.length < 7) {
            Alert.alert("Virhe", "Salasana on liian lyhyt")
            return
        }
        else if (!isValidEmail(email)) {
            Alert.alert("Virhe", "Sähköposti ei kelpaa")
            return
        }
        try {
            createUserWithEmailAndPassword(auth, email, password)
            navigation.navigate("LoginPage")
            Alert.alert("Onnistui", "Rekisteröinti onnistui! Voit nyt kirjautua sisään")
        } catch (error) {
            console.error("Registration failed", error)
        }
    }

    const isValidEmail = (email: any) => {
        return emailValidator.validate(email)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.loginText}>Rekisteröidy käyttäjäksi FitnessAppiin</Text>
            <View style={styles.innerContainer}>
                <Input
                    style={styles.input}
                    placeholder="sähköposti.."
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(t) => {
                        setEmail(t)
                    }}
                />
                <Text style={styles.passwordText}>Salasanan on oltava vähintään seitsemän merkkiä pitkä</Text>
                <Input
                    style={styles.input}
                    placeholder="salasana.."
                    autoCapitalize="none"
                    value={password}
                    onChangeText={(t) => {
                        setPassword(t)
                    }}
                    secureTextEntry={true}
                />
                <Input
                    style={styles.input}
                    placeholder="salasana uudelleen.."
                    autoCapitalize="none"
                    value={passwordConfirm}
                    onChangeText={(t) => {
                        setPasswordConfrim(t)
                    }}
                    secureTextEntry={true}
                />
            </View>
            <Chip
                title="Luo käyttäjätunnus"
                onPress={() => {
                    handleCreateUser()
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
    )
}