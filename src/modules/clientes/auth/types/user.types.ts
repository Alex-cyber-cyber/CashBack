export type UserRole = "client";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    phone?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    provider: 'password' | 'google' | 'github' | 'facebook';
    emailVerified: boolean;
}