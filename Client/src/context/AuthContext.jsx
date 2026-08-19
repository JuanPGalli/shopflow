import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../firebase/firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

/* Creating a context object. */
export const authContext = createContext();

/**
 * UseAuth() is a function that returns the context object that was created by the useContext() hook.
 */
export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  /* A hook that is called when the component is mounted and when the component is updated. */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
    });
    return () => unsubscribe();
  }, []);
  /**
   * "register" is a function that takes two arguments, "email" and "password", and then calls the
   * "createUserWithEmailAndPassword" function with the "auth" object and the "email" and "password"
   * arguments.
   */

  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  /**
   * "login" is a function that takes two parameters, "email" and "password", and returns a promise that
   * resolves to the result of calling "signInWithEmailAndPassword" with the parameters "auth", "email",
   * and "password".
   */

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  /**
   * The loginWithGoogle function is an async function that returns the result of the signInWithPopup
   * function, which takes the auth and responseGoogle parameters.
   *The responseGoogle object is being returned.
   */
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  /**
   * The logout function is an asynchronous function that calls the signOut function and logs the
   * response to the console.
   */
  const logout = () => signOut(auth);

  return (
    <authContext.Provider value={{ register, login, loginWithGoogle, logout, user }}>
      {children}
    </authContext.Provider>
  );
}
