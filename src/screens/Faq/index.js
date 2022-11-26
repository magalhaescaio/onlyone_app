import { Dimensions, Image, ScrollView, StyleSheet, Text, View, } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import TopHeader from './../../components/TopHeader'
import { palette } from "../../constants/colors"

import Construction from './../../assets/images/under_construction.png'

export default function (props) {
    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
            <TopHeader />

            <ScrollView style={{ marginBottom: insets.top }}>

                <View style={styles.imageContainer}>
                    <Image source={Construction} style={styles.image} />
                </View>

                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: palette.white, fontWeight: 'bold', fontSize: 24}}>Desculpe!!</Text>
                    <Text style={{color: palette.white, fontWeight: '400', fontSize: 20, marginTop: 10}}>Área em construção.</Text>
                    <Text style={{color: palette.white, fontWeight: '200', fontSize: 16, marginTop: 10}}>Novidades em breve.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: palette.darkGray,
        minHeight: Dimensions.get('window').height,
    },

    image: {
        resizeMode: 'contain',
        width: '52%',
    },

    imageContainer: {
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center'
    }
})