import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        marginHorizontal: 50,
        height: 40,
        width: 170,
        marginVertical: 10,
    },
    homeText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 24,
        color: "#414141",
        fontWeight: "600"
    },
    bottomText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "400"
    },
    headerText: {
        fontSize: 22,
    },
    map: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 4,
        marginTop: 4
    },
    dateContainer: {
        flex: 1,
        justifyContent: "space-between",
        marginTop: 30
    },
    input: {
        textAlign: "center",
    },
    chipView: {
        marginBottom: 40,
        marginTop: 15,
        flex: 0.75,
    },
    placement: {
        alignItems: "center",
        marginTop: 150,
        fontSize: 24
    },
    trainingText: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 5
    },
    trainingItem: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "300"
    },
    todaysActivity: {
        marginBottom: 205,
        alignItems: "center"
    }
})