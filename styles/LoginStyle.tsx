import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18
    },
    input: {
        textAlign: "center",

    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "75%",
    },
    welcomeText: {
        fontSize: 24,
        marginBottom: 20,
        color: "#414141",
    },
    loginText: {
        fontSize: 24,
        marginBottom: 30,
        color: "#414141",
        textAlign: "center"
    },
    passwordText: {
        textAlign: "center",
        marginBottom: 15,
        fontSize: 16,
        width: "80%"
    },
    resetView: {
        width: "75%"
    },
    resetText: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 10
    },
    resetChip: {
        flexDirection: "row",
        justifyContent: "center"
    }
})