import { View, Text, ScrollView, Image, Alert } from "react-native";
import { styles } from "../styles/FrontpageStyle";
import { useState } from "react";
import { Chip, ListItem } from "@rneui/themed";
import RNPickerSelect from 'react-native-picker-select';
import React from "react";
import config from "../config/apiConfig"

export default function Trainings() {
    const [muscle, setMuscle] = useState("")
    const [results, setResults] = useState<any>([])
    const [expandedId, setExpandedId] = useState(null)

    const requestOptions: any = {
        method: "GET",
        headers: {
            'X-RapidAPI-Key': config.API_KEY,
            'X-RapidAPI-Host': config.API
        }
    };

    const getTrainings = async () => {
        if (muscle) {
            try {
                const response = await fetch(`${config.API_URL}${muscle}`, requestOptions);
                const data = await response.json();
                setResults(data);
            } catch (err) {
                console.log('error', err);
            }
        } else {
            Alert.alert("Virhe", "Valitse ensin kehon osa valikosta")
        }
    };
    return (
        <ScrollView style={{ width: "100%" }}>
            <Text style={{ textAlign: "center", fontSize: 18, marginTop: 10 }}>Valitse kehon osa, jota haluat treenata:</Text>
            <RNPickerSelect
                onValueChange={(value) => setMuscle(value)}
                placeholder={{ label: "Kehon osat..", color: "grey" }}
                items={[
                    { label: "Aerobinen", value: "cardio" },
                    { label: "Alaraajat", value: "lower legs" },
                    { label: "Käsien alavarret", value: "lower arms" },
                    { label: "Niska", value: "neck" },
                    { label: "Olkapäät", value: "shoulders" },
                    { label: "Olkavarret", value: "upper arms" },
                    { label: "Rinta", value: "chest" },
                    { label: "Selkä", value: "back" },
                    { label: "Vyötärö", value: "waist" },
                    { label: "Yläjalat", value: "upper legs" },
                ]}
            />
            <View>
                <Chip
                    size="lg"
                    type="solid"
                    color="orange"
                    title="Hae harjoitukset"
                    onPress={() => {
                        getTrainings()
                    }}
                />
            </View>
            <View>
                {results.slice(0, 50).map((item: any, key: any) => (
                    <ListItem.Accordion
                        key={key}
                        content={
                            <>
                                <ListItem.Content>
                                    <ListItem.Title style={{ fontSize: 22, color: "orange" }}>{item.name} </ListItem.Title>
                                    <ListItem.Subtitle style={{ fontSize: 18 }}>Bodypart: {item.bodyPart}</ListItem.Subtitle>
                                    <ListItem.Subtitle style={{ fontSize: 18 }}>Equipment: {item.equipment}</ListItem.Subtitle>
                                </ListItem.Content>
                            </>
                        }
                        isExpanded={expandedId === key}
                        onPress={() => {
                            setExpandedId(expandedId === key ? null : key);
                        }}
                    >
                        <ListItem>
                            <ListItem.Content>
                                <ListItem.Subtitle style={{ fontSize: 16 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={{ uri: item.gifUrl }} style={{ height: 200, width: 200 }} />
                                    </View>
                                </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    </ListItem.Accordion>
                ))}
            </View>
        </ScrollView>
    )
}
