import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notification from 'expo-notifications'
import { format } from 'date-fns'

export interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string],
    frequency: {
        times: number,
        repeat_every: string;
    },
    hour: string;
    dateTimeNotification: Date
}

export interface StoragePlantProps {
    [id: string]: {
        data: PlantProps;
        notificationId: string
    }
}

export async function savePlant(plant: PlantProps) {
    try {
        const nextTime = new Date(plant.dateTimeNotification);
        const now = new Date();

        const { times, repeat_every } = plant.frequency;
        if(repeat_every === 'week') {
            const inteval = Math.trunc(7 / times);
            nextTime.setDate(now.getDate() + inteval)
        } else {
            nextTime.setDate(now.getDate() + 1);
        }

        const seconds = Math.abs(
            Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
        );

        const notificationId = await Notification.scheduleNotificationAsync({
            content: {
                title: 'Heey, 🌱',
                body: `Está na hora de regar sua ${plant.name}`,
                sound: true,
                priority: Notification.AndroidNotificationPriority.HIGH,
                data: {
                    plant
                }
            },
            trigger: {
                seconds: seconds < 60 ? 60 : seconds,
                repeats: true
            }
        })

        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const newPlant = {
            [plant.id]: {
                data: plant,
                notificationId
            }
        }

        await AsyncStorage.setItem('@plantmanager:plants', 
        JSON.stringify({
            ...newPlant,
            ...oldPlants
        }));
    } catch (e) {
         throw new Error(e);
    }
}

export async function loadPlants(): Promise<PlantProps[]> {
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const sortedPlants = Object
            .keys(plants)
            .map(plantKey => ({
                ...plants[plantKey].data,
                hour: format(new Date(plants[plantKey].data.dateTimeNotification), 'HH:mm')
            }))
            .sort((a, b) => 
                Math.floor(
                    new Date(a.dateTimeNotification).getTime() / 1000 -
                    Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
                )
            );

            return sortedPlants;
    } catch (e) {
        throw new Error(e);
    }
}

export async function removePlant(plantId: string): Promise<void> {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? JSON.parse(data) as StoragePlantProps : {}

    if(plants[plantId].notificationId)
        await Notification.cancelScheduledNotificationAsync(plants[plantId].notificationId);

    delete plants[plantId];

    await AsyncStorage.setItem(
        '@plantmanager:plants',
        JSON.stringify(plants)    
    );
}