export type RootStackParamList = {
    MainTabs: undefined
    Food: { barcode: string; productName: string }
    ResultScreen: undefined
    FormBarcodeScreen: undefined
}

export type TabParamList = {
    Home: undefined
    History: undefined
    Profile: undefined
}

// Use in screens
// import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

// type FoodScreenProps = NativeStackScreenProps<RootStackParamList, 'Food'>
type HomeScreenProps = BottomTabScreenProps<TabParamList, 'Home'>