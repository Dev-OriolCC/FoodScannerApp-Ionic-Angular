import { AppStackScreenProps, DemoTabScreenProps } from "@/navigators/navigationTypes";
import { FC, useEffect, useState } from "react";
import { Modal, View, ViewStyle, StyleSheet, TextStyle } from "react-native";
import { useAppTheme } from "@/theme/context";
import { $styles } from "@/theme/styles";
import { Screen } from "@/components/Screen"
import { Button } from "@/components/Button"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField";


export const HomeScreen: FC<DemoTabScreenProps<"Home">> = (_props) => {
    const { themed, theme } = useAppTheme()
    const [modalOpen, setModalOpen] = useState(false);
    const { navigation } = _props;

    useEffect(() => {
        console.log("Home Screen");
    }, [])

    function scanbarcode() {
        setModalOpen(!modalOpen)
        console.log("scanbarcode..." + modalOpen)
    }

    function submitBarcode() {

        //TODO: Add Loading Effect!
        navigation.navigate("Food")
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]}
            contentContainerStyle={[$styles.container, themed($container)]}
        >
            <Text preset="heading">Home Screen2</Text>
            <Button style={themed($customButtonStyle)} onPress={scanbarcode} text={`ScanBarcode`} />
            <Text>Note: Beta. This app only works with products that contain nutritional facts in English</Text>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalOpen}
                onRequestClose={() => setModalOpen(false)}
            >
                <View style={themed($customModelOverlay)}>
                    <View style={themed($customModalContent)}>
                        <Text preset="heading" style={styles.modalTitle}>Scan Barcode</Text>

                        <TextField
                            labelTx="homeScreen:scanbarcodeInput.useCase.passingContent.viaLabel.labelTx"
                            labelTxOptions={{ prop: "label" }}
                            placeholderTx="homeScreen:scanbarcodeInput.useCase.passingContent.viaLabel.placeholder"
                            placeholderTxOptions={{ prop: "placeholder" }}
                            containerStyle={themed($customContainerTextFieldStyle)}
                        />
                        <Button text={`Scan with Camera`} />

                        <View style={themed($customButtonsViewStyle)}>
                            <Button
                                text="Close"
                                onPress={() => setModalOpen(false)}
                                style={styles.closeButton}
                            />
                            <Button
                                text="Submit"
                                onPress={() => submitBarcode()}
                                style={styles.submitButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>


        </Screen>

    )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    paddingBottom: spacing.xxl,
})

const $customContainerTextFieldStyle: ThemedStyle<ViewStyle> = ({ }) => ({
    width: "85%",
    marginBottom: 15
})

const $customButtonStyle: ThemedStyle<ViewStyle> = ({ colors, typography }) => ({
    marginTop: "50%",
    marginBottom: "10%",
    backgroundColor: colors.success,
    height: 10,
    top: 10,
    bottom: 10,
    color: colors.palette.neutral900,
    fontFamily: typography.primary.bold,
    fontSize: 10
})

const $customButtonsViewStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingHorizontal: '5%',
    gap: 10
})

const $customModelOverlay: ThemedStyle<ViewStyle> = () => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
})

const $customModalContent: ThemedStyle<ViewStyle> = () => ({
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
})

const styles = StyleSheet.create({
    modalTitle: {
        marginBottom: 15,
    },
    closeButton: {
        minWidth: 25,
    },
    submitButton: {
        backgroundColor: 'rgba(65, 228, 160, 1)'
    }
});