export interface Product {
    /**
     * @Additional_colums_for_firebase
     */
    id: string
    userId: string;
    date: string;
    stickers: number;
    /**@END */
    productName: string;
    code: string;
    //
    calories: string;
    sugars: string;
    saturatedFat: string;
    salt: string;
    //
    isCalories: boolean;
    isSugars: boolean;
    isSaturatedFat: boolean;
    isSalt: boolean;
    isCaffeine: boolean;
    isColorant: boolean;
    //
    scoreLetter: string;
    status: boolean;
    statusMessage: string;

}