// src/context/index.jsx  (or wherever your AllProviders is)
import React from "react";
import { AuthProvider } from "./AuthContext";
import { GameProvider } from "./GameContext";
import { AdminProvider } from "./AdminContext";
import { RedemptionProvider } from "./RedemptionContext";

export const AllProviders = ({ children }) => (
  <AuthProvider>
    <GameProvider>
      <AdminProvider>
        <RedemptionProvider>{children}</RedemptionProvider>
      </AdminProvider>
    </GameProvider>
  </AuthProvider>
);
