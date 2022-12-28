import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(userEmail: string, userPassword: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBWQc6cOoWL83M8xfgCKh56K6EGgIfgYdg',
      {
        email: userEmail,
        password: userPassword,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError));
  }

  login(userEmail: string, userPassword: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBWQc6cOoWL83M8xfgCKh56K6EGgIfgYdg',
      {
        email: userEmail,
        password: userPassword,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => {
        return errorMessage;
      });
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already.';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'The email or password is not correct. Please try again.';
    }
    
    return throwError(() => {
      return errorMessage;
    });
  }
}
