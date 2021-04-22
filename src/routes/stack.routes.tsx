import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { Welcome } from '../pages/Welcome';
import { Confirmation } from '../pages/Confirmation';
import { UserIdentification } from '../pages/UserIdentification';
import { PlantSelect } from '../pages/PlantSelect';

import colors from '../styles/colors';

const StackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
    <StackRoutes.Navigator
        headerMode="none"
        screenOptions={{
            cardStyle: {
                backgroundColor: colors.white
            }
        }}
    >
        <StackRoutes.Screen name="Welcome" component={Welcome} />
        <StackRoutes.Screen name="Confirmation" component={Confirmation} />
        <StackRoutes.Screen name="UserIdentification" component={UserIdentification} />
        <StackRoutes.Screen name="PlantSelect" component={PlantSelect} />

    </StackRoutes.Navigator>
);

export default AppRoutes;