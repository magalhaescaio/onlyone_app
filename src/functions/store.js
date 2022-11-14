import AsyncStorage from '@react-native-async-storage/async-storage'


const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        return true
    } catch (e) {
        return false
        // console.log(e)
    }
}

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)

        return value
    } catch (e) {
        return false
    }
}

const deleteData = async (key) => {
    try {
        const value = await AsyncStorage.removeItem(key)

        return true
    } catch (e) {
        return false
    }
}

export {
    storeData,
    getData,
    deleteData
}