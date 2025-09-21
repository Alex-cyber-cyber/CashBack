export type RegistroPuntosDTO = {
  correo: string;
  identidad: string;
  totalFactura: number;
  totalPts: number;
};

export type RegistroPuntosDoc = RegistroPuntosDTO & {
  id?: string;
  createdAt: any;     // Firestore Timestamp
  createdBy: string;  // uid
  tenantId?: string;  // opcional
};
