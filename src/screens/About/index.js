import { Dimensions, Image, ScrollView, StyleSheet, Text, View, } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

import TopHeader from './../../components/TopHeader'
import { palette } from "../../constants/colors"

import Only from './../../assets/images/logo_menu.png'

export default function (props) {
    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
            <TopHeader />

            <ScrollView style={{
                backgroundColor: palette.dark,
            }}>

                <View style={{
                    marginTop: 30,
                    height: 120,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={Only} style={{
                        resizeMode: 'contain',
                        width: 120,
                        height: 120,
                    }} />
                </View>

                <View style={{
                    margin: 20,
                    padding: 10
                }}>
                    <Text style={{
                        
                        color: palette.white
                    }}>
                        Nossa empresa atua no mercado de domótica realizando projetos de automação de residências, escritórios e condomínios. Produzimos soluções que trazem segurança, economia e facilidade para o dia a dia.
                    </Text>

                    <Text style={{
                        
                        marginTop: 10,
                        color: palette.white
                    }}>
                        Temos a missão de levar a nossos clientes tudo o que há em matéria de gestão de energia combinado com o melhor pós-venda.

                    </Text>

                    <Text style={{
                        
                        marginTop: 20,
                        color: palette.white,
                        fontWeight: 'bold'
                    }}>
                        PRINCIPAIS VANTAGENS DA AUTOMAÇÃO
                    </Text>

                    <View style={{
                        marginTop: 20,
                        display: 'flex',
                        flexDirection: 'row',
                        color: palette.white
                    }}>
                        <View style={{
                            width: '15%',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {/* <Feather
                                name={'home'}
                                size={30}
                                color={colors.darkBlueEnjoy}
                            /> */}
                            <MaterialIcons name={'security'} size={38} color={palette.lightGreen} />

                        </View>
                        <View style={{
                            width: '85%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>

                            <Text style={{
                                
                                textAlign: 'left',
                                marginLeft: 10,
                                color: palette.white,
                                fontWeight: 'bold'
                            }}>
                                Segurança
                            </Text>

                            <Text style={{
                                
                                fontSize: 12,
                                marginLeft: 10,
                                color: palette.white
                            }}>
                                Em primeiro lugar destaca-se a segurança como um dos grandes benefícios desse investimento. Com a automação residencial você pode desligar ou acionar qualquer equipamento da sua casa de onde você estiver. Compatível com Alexa.
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        marginTop: 20,
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            width: '15%',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {/* <Feather
                                name={'thumbs-up'}
                                size={30}
                                color={colors.darkBlueEnjoy}
                            /> */}
                            <MaterialCommunityIcons name={'sunglasses'} size={38} color={palette.lightGreen} />
                        </View>
                        <View style={{
                            width: '85%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>

                            <Text style={{
                                
                                textAlign: 'left',
                                marginLeft: 10,
                                color: palette.white,
                                fontWeight: 'bold'
                            }}>
                                Conforto
                            </Text>

                            <Text style={{
                                
                                fontSize: 12,
                                marginLeft: 10,
                                color: palette.white

                            }}>
                                Nada melhor do que a comodidade de abrir portas e portões à distância sem precisar sair do local onde se está.                            </Text>
                        </View>
                    </View>

                    <View style={{
                        marginTop: 20,
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            width: '15%',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {/* <Feather
                                name={'dollar-sign'}
                                size={30}
                                color={colors.darkBlueEnjoy}
                            /> */}
                            <MaterialIcons name={'attach-money'} size={38} color={palette.lightGreen} />
                        </View>
                        <View style={{
                            width: '85%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>

                            <Text style={{
                                
                                textAlign: 'left',
                                marginLeft: 10,
                                color: palette.white,
                                fontWeight: 'bold'
                            }}>
                                Economia a longo prazo
                            </Text>

                            <Text style={{
                                
                                fontSize: 12,
                                marginLeft: 10,
                                color: palette.white
                            }}>
                                Quem nunca esqueceu a luz da sala acesa ou um equipamento ligado quando foi dormir ou viajar? Esse tipo de problema pode ser evitado com a possibilidade de predeterminação dos horários em que os equipamentos serão ligados ou apagados.
                            </Text>
                        </View>
                    </View>
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
})