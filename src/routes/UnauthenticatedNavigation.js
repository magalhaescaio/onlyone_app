import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LoginScreen from './../screens/Login'

const Stack = createNativeStackNavigator()


export default function UnauthenticatedNavigation() {

    return (
        <NavigationContainer>
            <Stack.Navigator>

                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}