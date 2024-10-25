import { DataState } from "../enum/dataState.enum";

export interface State<T> {
    dataState: DataState;
    appData?: T;
    error?: string;
}