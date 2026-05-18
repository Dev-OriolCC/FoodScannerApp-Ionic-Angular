export type Product = {
    barcode: string
    calories?: number
    [key: string]: unknown
}

export type RootStackParamList = {
    MainTabs: undefined
    Food: { barcode: string; productName: string }
    ResultScreen: { product: Product }
    FormBarcodeScreen: undefined
    LoginScreen: undefined
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
