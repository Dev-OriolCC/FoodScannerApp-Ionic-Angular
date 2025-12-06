import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, StyleSheet, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/i18n"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { HomeScreen } from './HomeScreen';
import { Icon } from "@/components/Icon"

// images
const nutriScoreA = require("@assets/images/stickers/nutriScoreA.jpg")

const calories = require("@assets/images/stickers/calories.png")
const salt = require("@assets/images/stickers/salt.png")
const sugars = require("@assets/images/stickers/sugars.png")
const saturated = require("@assets/images/stickers/saturated.png")

const caffeine = require("@assets/images/stickers/caffeine.png")
const colorant = require("@assets/images/stickers/colorant.png")
const legends = require("@assets/images/stickers/leyenda.png")

interface FoodScreenProps extends AppStackScreenProps<"Food"> {}

export const FoodScreen: FC<FoodScreenProps> = function FoodScreen(_props) {
    const { themed, theme } = useAppTheme()

    const { navigation } = _props;

    function goBack() {
        console.log("yaayy")
    }
    
    return (
        <Screen preset="scroll" safeAreaEdges={["top"]}>
            <View style={themed($container)}>
                {/* Close button and Title */}
                <View style={themed($header)}>
                    <Button onPress={goBack}>
                        <Icon icon={"back"} color={theme.colors.text} size={35} />
                    </Button>
                </View>

                {/* Product Title */}
                <Text preset="heading" style={themed($title)}>
                    Ocean Spray Cranberry 500ml
                </Text>

                {/* Barcode */}
                <Text style={themed($barcode)}>[ 123213 ]</Text>

                {/* Nutri-Score Section */}
                <Text preset="subheading" style={themed($sectionTitle)}>
                    Nutri-Score
                </Text>
                <Image 
                    source={nutriScoreA} 
                    style={themed($nutriScoreImage)}
                    resizeMode="contain"
                />

                {/* Four Warning Icons Row */}
                <View style={themed($warningRow)}>
                    <Image 
                        source={calories} 
                        style={themed($warningIcon)}
                        resizeMode="contain"
                    />
                    <Image 
                        source={salt} 
                        style={themed($warningIcon)}
                        resizeMode="contain"
                    />
                    <Image 
                        source={sugars} 
                        style={themed($warningIcon)}
                        resizeMode="contain"
                    />
                    <Image 
                        source={saturated} 
                        style={themed($warningIcon)}
                        resizeMode="contain"
                    />
                </View>

                {/* Caffeine Warning */}
                <Image 
                    source={caffeine} 
                    style={themed($fullWidthWarning)}
                    resizeMode="contain"
                />

                {/* Sweeteners Warning */}
                <Image 
                    source={legends} 
                    style={themed($fullWidthWarning)}
                    resizeMode="contain"
                />

                {/* Excessive Table */}
                <Text preset="subheading" style={themed($sectionTitle)}>
                    Excessive Table
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellLabel}>Calories</Text>
                            <Text style={styles.cellValue}>YES</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellLabel}>Sugar</Text>
                            <Text style={styles.cellValue}>YES</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellLabel}>Sat. Fat</Text>
                            <Text style={styles.cellValue}>YES</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellLabel}>Salt</Text>
                            <Text style={styles.cellValue}>YES</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellLabel}>Caffeine</Text>
                            <Text style={styles.cellValue}>YES</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellLabel}>Colorant</Text>
                            <Text style={styles.cellValue}>YES</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    )

}

const $container: ThemedStyle<ViewStyle> = ({}) => ({
    flex: 1,
    padding: 20,
})

const $header: ThemedStyle<ViewStyle> = () => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
})

const $title: ThemedStyle<ViewStyle> = () => ({
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
})

const $barcode: ThemedStyle<ViewStyle> = () => ({
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 30,
})

const $sectionTitle: ThemedStyle<ViewStyle> = () => ({
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
})

const $nutriScoreImage: ThemedStyle<ImageStyle> = () => ({
    width: '70%',
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
})

const $warningRow: ThemedStyle<ViewStyle> = () => ({
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
})

const $warningIcon: ThemedStyle<ImageStyle> = () => ({
    width: 70,
    height: 70,
})

const $fullWidthWarning: ThemedStyle<ImageStyle> = () => ({
    width: '95%',
    height: 60,
    alignSelf: 'center',
    marginBottom: 15,
})

const styles = StyleSheet.create({
    closeButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    table: {
        marginTop: 10,
        marginBottom: 30,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tableCell: {
        flex: 1,
        backgroundColor: '#fafafaff',
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    cellLabel: {
        color: '#000000ff',
        fontSize: 14,
        marginBottom: 5,
    },
    cellValue: {
        color: '#ff6b6b',
        fontSize: 16,
        fontWeight: 'bold',
    },
});