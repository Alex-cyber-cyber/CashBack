import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../../../../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
export const AuthContext = createContext({ user: null, loading: true });
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);
    return _jsx(AuthContext.Provider, { value: { user, loading }, children: children });
}
