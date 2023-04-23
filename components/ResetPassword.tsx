import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { styles } from "../styles/LoginStyle";
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { Chip, Input, Text } from '@rneui/themed';

export default function ResetPassword({ navigation }) {
    const [email, setEmail] = useState("")

    const resetPassword = async () => {
        try {
            if (email) {
                await sendPasswordResetEmail(auth, email)
                console.log("Password reset email sent succesfully")
                Alert.alert("Onnistui!", "Sähköpostiisi lähetettiin linkki salasanan nollaamista varten")
                setEmail("")
            } else {
                Alert.alert("Varoitus", "Sähköpostikenttä ei voi olla tyhjä")
            }
        } catch (error) {
            Alert.alert("Varoitus", "Anna kelvollien sähköposti")
        }
    }

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.loginText}>Kirjoita sähköpostisi nollataksesi salasanasi</Text>
                <Input
                    style={styles.input}
                    placeholder="sähköposti.."
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(t) => {
                        setEmail(t)
                    }}
                />
            </View>
            <View style={styles.resetChip}>
                <Chip
                    title="Nollaa salasanasi"
                    size="lg"
                    type="solid"
                    color="#414141"
                    onPress={() => {
                        resetPassword()
                    }}
                    icon={{
                        name: "lock-open",
                        color: "white",
                        type: "material"
                    }}
                />
            </View>
        </KeyboardAvoidingView>
    )
}