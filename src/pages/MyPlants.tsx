import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, FlatList, Alert } from 'react-native'
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import waterDropImage from '../assets/waterdrop.png';

import fonts from '../styles/fonts';
import colors from '../styles/colors'

import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Header } from '../components/Header'
import { Load } from '../components/Load';
import { loadPlants, PlantProps, removePlant, StoragePlantProps } from '../libs/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await loadPlants();
    
            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: ptBR }
            )

            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} em ${nextTime}.`
            )

            setMyPlants(plantsStoraged);
            setLoading(false)
        }

        loadStorageData();
    }, [])

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remove', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😢',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);

                        setMyPlants(oldValue => (
                            oldValue.filter(item => item.id !== plant.id)
                        ));
                    } catch (e) {
                        console.log('Erro ao remover a planta', e);
                        Alert.alert('Erro ao remover a planta 😢');
                    }
                }
            }
        ])
    }

    if(loading)
        return <Load />

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotilight}>
                <Image 
                    source={waterDropImage}
                    style={styles.spotilightImage}
                />

                <Text style={styles.spotilightText}>
                    {nextWatered}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>
                
                <FlatList 
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => 
                        <PlantCardSecondary 
                            data={item} 
                            handleRemove={() => handleRemove(item)}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotilight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotilightImage: {
        width: 60,
        height: 60,
    },
    spotilightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
        textAlign: 'justify'
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20,
    }
})
