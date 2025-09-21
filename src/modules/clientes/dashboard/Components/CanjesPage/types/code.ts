export type Wallet = {
  cashbackBalance: number;
  totalEarned?: number;
  totalRedeemed?: number;
  updatedAt?: any; // Firestore Timestamp
};

export type DiscountCode = {
  code: string;   // id del doc
  uid: string;    // dueño (cliente)
  amount: number; // monto descontado del saldo
  isValid: boolean;
  status: "generated" | "redeemed" | "expired" | "cancelled";
  createdAt: any;  // Firestore Timestamp
  expiresAt: any | null;  // Firestore Timestamp | null
  redeemedAt: any | null; // Firestore Timestamp | null
  redeemedBy?: string | null;
};
