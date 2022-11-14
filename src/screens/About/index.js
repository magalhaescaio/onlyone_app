import { Dimensions, ScrollView, StyleSheet, Text, } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import TopHeader from './../../components/TopHeader'
import { palette } from "../../constants/colors"

export default function (props) {
    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
            <TopHeader />

            <ScrollView style={{ marginBottom: insets.top}}>

                <Text style={{color: 'white'}}>
                    About
                </Text>

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
})