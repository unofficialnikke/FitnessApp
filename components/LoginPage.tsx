import { Chip, Input, Text } from '@rneui/themed';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { styles } from '../styles/LoginStyle';

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState("")
    const [emailReset, setEmailReset] = useState("")
    const [password, setPassword] = useState("")
    const [visible, setVisible] = useState(false)

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
    const resetPassword = async () => {
        try {
            if (emailReset) {
                await sendPasswordResetEmail(auth, emailReset)
                console.log("Password reset email sent succesfully")
                Alert.alert("Onnistui", "Sähköpostiisi lähetettiin linkki salasanan nollaamista varten")
                setEmailReset("")
                setVisible(false)
            } else {
                Alert.alert("Varoitus", "Sähköpostikenttä ei voi olla tyhjä")
            }
        } catch (error) {
            Alert.alert("Varoitus", "Anna kelvollien sähköposti")
        }
    }

    const openReset = () => {
        setVisible(true)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
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
                <View style={{ height: 30 }}></View>
                <Chip
                    title="Unohditko salasanasi?"
                    size="md"
                    type="solid"
                    color="#414141"
                    onPress={() => {
                        openReset()
                    }}
                />
            </View>
            <View style={styles.resetView}>
                {visible && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.resetText}>Kirjoita sähköpostisi nollataksesi salasanasi</Text>
                        <Input
                            style={styles.input}
                            placeholder="sähköpostisi.."
                            value={emailReset}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={(t) => {
                                setEmailReset(t)
                            }}
                        />
                        <View style={styles.resetChip}>
                            <Chip
                                title="Nollaa salasanasi"
                                size="md"
                                type="solid"
                                color="orange"
                                onPress={() => {
                                    resetPassword()
                                }}
                            />
                        </View>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    )
}