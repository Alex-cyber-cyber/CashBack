import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../../../../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { ensureEntrepreneurProfile } from "../services/emprendedor.services";
export const AuthContext = createContext({
    user: null,
    profile: null,
    loading: true,
});
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    const profileData = await ensureEntrepreneurProfile({ uid: firebaseUser.uid });
                    setProfile(profileData);
                }
                catch (err) {
                    console.error("Error obteniendo/creando perfil del emprendedor:", err);
                    setProfile(null);
                }
            }
            else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    return (_jsx(AuthContext.Provider, { value: { user, profile, loading }, children: children }));
};
