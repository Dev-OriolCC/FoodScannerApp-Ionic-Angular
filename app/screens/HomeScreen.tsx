import { AppStackScreenProps, DemoTabScreenProps } from "@/navigators/navigationTypes";
import { FC, useEffect } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "@/theme/context";
import { $styles } from "@/theme/styles";
import { Screen } from "@/components/Screen"




export const HomeScreen: FC<DemoTabScreenProps<"Home">> = (_props) => {
    const { themed, theme } = useAppTheme()

    useEffect(() => {
        console.log("Home Screen");
    }, [])

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$styles.flex1}>
            <Text>HomeScreen</Text>
        </Screen>

    )
}