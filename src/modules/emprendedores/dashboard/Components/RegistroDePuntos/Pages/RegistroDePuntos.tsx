// src/modules/emprendedores/dashboard/Components/RegistroDePuntos/Pages/RegistroDePuntos.tsx
import React, { useEffect } from "react";
import RegistroPuntosForm from "./RegistroPuntosForm";
import { createRegistroPuntos } from "../services/registroPuntos.repository";
import { RegistroPuntosDTO } from "../types/registroPuntos";
import { ensureTestAuth } from "../../../../../../../firebase/firebase.config";

export default function RegistroDePuntos() {
  useEffect(() => {
    ensureTestAuth().catch(console.error); 
  }, []);

  async function onConfirm(payload: RegistroPuntosDTO) {
    console.debug("[Container] onConfirm payload:", payload);
    await createRegistroPuntos(payload);
  }

  return (
    <RegistroPuntosForm
      currency="L"
      pointsFormula={(t) => Math.max(0, Math.floor(t / 10))}
      onConfirm={onConfirm}
    />
  );
}
