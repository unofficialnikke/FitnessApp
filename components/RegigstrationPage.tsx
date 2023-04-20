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
    const [error, setError] = useState("")

    const handleCreateUser = async () => {
        if (password !== passwordConfirm) {
            setError("Salasanat eivät täsmää")
            Alert.alert("Virhe", "Salasanat eivät täsmää")
            return
        }
        else if (password.length < 7) {
            setError("Salasana on liian lyhyt")
            Alert.alert("Virhe", "Salasana on liian lyhyt")
            return
        }
        else if (!isValidEmail(email)) {
            setError("Sähköposti ei kelpaa")
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
                    value={email}
                    onChangeText={(t) => {
                        setEmail(t)
                    }}
                />
                <Text style={{ textAlign: "center", marginBottom: 15, fontSize: 16, width: "80%" }}>Salasanan on oltava vähintään seitsemän merkkiä pitkä</Text>
                <Input
                    style={styles.input}
                    placeholder="salasana.."
                    value={password}
                    onChangeText={(t) => {
                        setPassword(t)
                    }}
                    secureTextEntry={true}
                />
                <Input
                    style={styles.input}
                    placeholder="salasana uudelleen.."
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