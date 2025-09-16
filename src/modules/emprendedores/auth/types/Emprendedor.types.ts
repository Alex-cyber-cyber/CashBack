export type UserRole = "Emprendedor";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string; 
    phone?: string;
    nombrePropietario: string;
    nombreComercial: string;
    razonSocial: string;
    rtn: string;
    categoria: string;
    descripcion: string;
    pais: string;
    departamento: string;
    ciudad: string;
    direccion: string;
    logo?: string; 


    role: UserRole; 
    provider: 'password' | 'google' | 'github' | 'facebook';
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}