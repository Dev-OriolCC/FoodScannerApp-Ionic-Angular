import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { CustomHttpResponse, ProductState } from "../interface/appState";
import { Product } from "../interface/product";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class ScannerService {

    private readonly server: string = environment.backendUri;

    constructor(private http: HttpClient) { }

    $product = (code: string) => <Observable<CustomHttpResponse<ProductState>>>
        this.http.post<CustomHttpResponse<Product>>(`${this.server}/${code}`, {})
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            )


    private handleError(error: HttpErrorResponse): Observable<any> {
        let errorMessage: string;
        if (error.error instanceof ErrorEvent) {
            // Frontend Error
            errorMessage = `[ERROR] A client error occurred: ${error.error.message}`;
        } else {
            if (error.error.reason) {
                // Backend Error
                errorMessage = error.error.reason;
            } else {
                // Generic Error
                errorMessage = `[ERROR] An error occurred: ${error.status}`;
            }
        }
        console.log(errorMessage);
        return throwError(() => errorMessage);
    }

}