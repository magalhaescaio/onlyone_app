import { useCallback, useEffect, useState } from 'react'
import { View, StatusBar } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import AuthContext from './src/context/Auth'
import { getData, deleteData } from './src/functions/store'
import UnauthenticatedNavigation from './src/routes/UnauthenticatedNavigation'
import AuthenticatedNavigation from './src/routes/AuthenticatedNavigation'

// import UnauthenticatedNavigation from './src/routes/UnauthenticatedNavigation'

// import Ionicons from '@expo/vector-icons/Ionicons';

SplashScreen.preventAutoHideAsync();

export default function App() {

	const [appIsReady, setAppIsReady] = useState(false);
	const [authenticated, setAuthenticated] = useState(false)
	const [userData, setUserData] = useState()


	useEffect(() => {
		async function prepare() {
			try {
				var token = await getData('onlyne-application-token')
				var data = await getData('onlyne-application-data')

				setUserData(data)

				if (token !== null) {
					setAuthenticated(true)
				} else {
					setAuthenticated(false)
				}
			} catch (e) {
				// console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare()
	}, [])

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync()
		}
	}, [appIsReady])

	if (!appIsReady) {
		return null
	}

	const loginUser = (token, uData) => {
		if (token) {
			setUserData(uData)
			setAuthenticated(true)
		}
	}
	const logoutUser = () => {
		deleteData('onlyne-application-token')
		deleteData('onlyne-application-data')

		setAuthenticated(false)
	}


	return (
		<AuthContext.Provider value={{
			loginUser,
			logoutUser
		}}>
			<StatusBar
				barStyle={'light-content'}
			/>
			<View onLayout={onLayoutRootView} />

			{authenticated
				? <AuthenticatedNavigation />
				: <UnauthenticatedNavigation />
			}
		</AuthContext.Provider>

	)
}
