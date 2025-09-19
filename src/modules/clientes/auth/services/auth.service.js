import { auth } from "../../../../../firebase/firebase.config";
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, signOut, signInWithPopup, updateProfile, createUserWithEmailAndPassword, } from "firebase/auth";
import { ensureUserProfile } from "./user.service";
const google = new GoogleAuthProvider();
const github = new GithubAuthProvider();
const facebook = new FacebookAuthProvider();
google.setCustomParameters({ prompt: "select_account" });
// ---------- Alta por email ----------
export async function signUpWithEmail(params) {
    const { user } = await createUserWithEmailAndPassword(auth, params.email, params.password);
    if (params.name)
        await updateProfile(user, { displayName: params.name });
    await ensureUserProfile({
        uid: user.uid,
        displayName: params.name,
        email: user.email ?? params.email,
        phone: params.phone,
        provider: "password",
        emailVerified: !!user.emailVerified,
    });
    return user;
}
// ---------- Login por email ----------
export async function loginWithEmail(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserProfile({
        uid: user.uid,
        displayName: user.displayName ?? "Usuario",
        email: user.email ?? email,
        photoURL: user.photoURL ?? "",
        provider: "password",
        emailVerified: !!user.emailVerified,
    });
    return user;
}
// ---------- Popup o Redirect ----------
async function popupOrRedirect(provider) {
    const coopMeta = document.querySelector('meta[http-equiv="Cross-Origin-Opener-Policy"]');
    const mustRedirect = !!coopMeta; // si tienes COOP activo, usa redirect
    if (mustRedirect) {
        await signInWithRedirect(auth, provider);
        return null;
    }
    try {
        const cred = await signInWithPopup(auth, provider);
        const u = cred.user;
        await ensureUserProfile({
            uid: u.uid,
            displayName: u.displayName ?? "Usuario",
            email: u.email ?? "",
            photoURL: u.photoURL ?? "",
            provider: provider instanceof GoogleAuthProvider
                ? "google"
                : provider instanceof GithubAuthProvider
                    ? "github"
                    : "facebook",
            emailVerified: !!u.emailVerified,
        });
        return u;
    }
    catch (e) {
        if (e?.code === "auth/popup-blocked" ||
            e?.code === "auth/popup-closed-by-user" ||
            e?.code === "auth/cancelled-popup-request") {
            await signInWithRedirect(auth, provider);
            return null;
        }
        throw e;
    }
}
// ---------- Proveedores ----------
export const loginWithGoogle = () => popupOrRedirect(google);
export const loginWithGithub = () => popupOrRedirect(github);
export const loginWithFacebook = () => popupOrRedirect(facebook);
// ---------- Resultado de redirect ----------
export async function handleAuthRedirectResult() {
    const res = await getRedirectResult(auth);
    const u = res?.user ?? null;
    if (u) {
        await ensureUserProfile({
            uid: u.uid,
            displayName: u.displayName ?? "Usuario",
            email: u.email ?? "",
            photoURL: u.photoURL ?? "",
            provider: (u.providerData?.[0]?.providerId?.includes("google") && "google") ||
                (u.providerData?.[0]?.providerId?.includes("github") && "github") ||
                (u.providerData?.[0]?.providerId?.includes("facebook") && "facebook") ||
                "password",
            emailVerified: !!u.emailVerified,
        });
    }
    return u;
}
// ---------- Logout ----------
export const logout = () => signOut(auth);
