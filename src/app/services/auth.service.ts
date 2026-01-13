import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private authInitialized = false;

  constructor(private auth: Auth) {
    // Listen to auth state changes and persist the session
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      this.authInitialized = true;
      
      // Store user state in localStorage for immediate access on refresh
      if (user) {
        localStorage.setItem('firebase_user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
      } else {
        localStorage.removeItem('firebase_user');
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('firebase_user');
  }

  isLoggedIn(): boolean {
    // Check both Firebase auth state and localStorage
    const currentUser = this.currentUserSubject.value;
    const storedUser = localStorage.getItem('firebase_user');
    
    return currentUser !== null || (storedUser !== null && !this.authInitialized);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Wait for Firebase auth to initialize
  async waitForAuth(): Promise<User | null> {
    if (this.authInitialized) {
      return this.currentUserSubject.value;
    }

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        this.authInitialized = true;
        unsubscribe();
        resolve(user);
      });
    });
  }
}
