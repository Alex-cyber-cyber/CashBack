import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../../../firebase/firebase.config";
import type { UserProfile } from "../types/user.types";

export async function ensureUserProfile(
  input: Partial<UserProfile> & { uid: string }
) {
  const ref = doc(db, "users", input.uid);
  const snap = await getDoc(ref);

  const base: UserProfile = {
    uid: input.uid,
    email: input.email ?? auth.currentUser?.email ?? "",
    displayName: input.displayName ?? auth.currentUser?.displayName ?? "Usuario",
    photoURL: input.photoURL ?? auth.currentUser?.photoURL ?? "",
    phone: input.phone ?? auth.currentUser?.phoneNumber ?? "",
    role: (input.role ?? "client") as UserProfile["role"],
    provider: (input.provider ?? "password") as UserProfile["provider"],
    emailVerified: input.emailVerified ?? !!auth.currentUser?.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!snap.exists()) {
    await setDoc(
      ref,
      { ...base, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true }
    );
    return base;
  } else {
    const updates = {
      displayName: base.displayName,
      photoURL: base.photoURL,
      emailVerified: base.emailVerified,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(ref, updates as any);
    return { ...(snap.data() as UserProfile), ...updates };
  }
}
