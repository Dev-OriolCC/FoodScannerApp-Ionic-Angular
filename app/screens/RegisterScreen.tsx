import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface RegisterScreenProps extends AppStackScreenProps<"Register"> { }

export const RegisterScreen: FC<RegisterScreenProps> = ({ navigation }) => {
    const authPasswordInput = useRef<TextInput>(null)

    const [authPassword, setAuthPassword] = useState("")
    const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { authEmail, setAuthEmail, setAuthToken, validationError } = useAuth()
    const [attemptsCount, setAttemptsCount] = useState(0)

    const {
        themed,
        theme: { colors }
    } = useAppTheme()

    const error = isSubmitted ? validationError : ""

    const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
        () =>
            function PasswordRightAccessory(props: TextFieldAccessoryProps) {
                return (
                    <PressableIcon
                        icon={isAuthPasswordHidden ? "view" : "hidden"}
                        color={colors.palette.neutral800}
                        containerStyle={props.style}
                        size={20}
                        onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
                    />
                )
            },
        [isAuthPasswordHidden, colors.palette.neutral800],
    )

    function register() {
        console.log("Register...")
    }

    function login() {
        navigation.navigate("Register", { screen: "Login", params: {} })
    }


    return (
        <Screen
            preset="auto"
            contentContainerStyle={themed($screenContentContainer)}
            safeAreaEdges={["top", "bottom"]}
        >
            <Text testID="login-heading" tx="registerScreen:register" preset="heading" />
            <Text tx="registerScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />
            {attemptsCount > 2 && (
                <Text tx="registerScreen:hint" size="sm" weight="light" style={themed($hint)} />
            )}

            <TextField
                value={authEmail}
                onChangeText={setAuthEmail}
                containerStyle={themed($textField)}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                labelTx="registerScreen:emailFieldLabel"
                placeholderTx="registerScreen:emailFieldPlaceholder"
                helper={error}
                status={error ? "error" : undefined}
                onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
            <TextField
                ref={authPasswordInput}
                value={authPassword}
                onChangeText={setAuthPassword}
                containerStyle={themed($textField)}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                secureTextEntry={isAuthPasswordHidden}
                labelTx="registerScreen:passwordFieldLabel"
                placeholderTx="registerScreen:passwordFieldPlaceholder"
                onSubmitEditing={register}
                RightAccessory={PasswordRightAccessory}
            />

            <TextField
                ref={authPasswordInput}
                value={authPassword}
                onChangeText={setAuthPassword}
                containerStyle={themed($textField)}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                secureTextEntry={isAuthPasswordHidden}
                labelTx="registerScreen:passwordConfirmFieldLabel"
                placeholderTx="registerScreen:passwordConfirmFieldPlaceholder"
                onSubmitEditing={register}
                RightAccessory={PasswordRightAccessory}
            />

            <Button
                testID="login-button"
                tx="registerScreen:tapToRegister"
                style={themed($tapButton)}
                preset="reversed"
                onPress={register}
            />
            {/* Goes to Register View */}
            <Button
                testID="register-button"
                tx="registerScreen:tapToLogIn"
                style={themed($tapButton)}
                onPress={login}
            />
        </Screen>
    )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
    marginBottom: spacing.lg,
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
    color: colors.tint,
    marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})