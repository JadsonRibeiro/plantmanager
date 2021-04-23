import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PlantSelect } from '../pages/PlantSelect';
import { MaterialIcons } from '@expo/vector-icons';
import { MyPlants } from '../pages/MyPlants';
import colors from '../styles/colors';

const AuthTab = createBottomTabNavigator();

export default function AuthRoutes () {
    return (
        <AuthTab.Navigator
            tabBarOptions={{
                activeTintColor: colors.green,
                inactiveTintColor: colors.heading,
                labelPosition: 'beside-icon'
            }}
        >
            <AuthTab.Screen 
                name="Nova Planta"
                component={PlantSelect}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons 
                            name="add-circle-outline"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />

            <AuthTab.Screen 
                name="Minhas Plantas"
                component={MyPlants}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons 
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </AuthTab.Navigator>
    )
}