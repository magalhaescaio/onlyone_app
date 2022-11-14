import { NavigationContainer } from "@react-navigation/native"

import DrawerNavigator from './DrawerNavigator'


export default function AuthenticatedNavigation(props) {
  
    return (
        <NavigationContainer>
            <DrawerNavigator
                {...props}
            />
        </NavigationContainer>
    )
}