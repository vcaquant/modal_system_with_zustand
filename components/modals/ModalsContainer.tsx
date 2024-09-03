"use client";

import React from "react";

import { isObjectEmpty } from "@/lib/utils";
import { useModalStore } from "@/src/stores/modal";

import { modals as modalsDescriber } from "./modalsDescriber";

export const ModalsContainer = () => {
  const [modals, setModals] = useModalStore((state) => [
    state.modals,
    state.setModals,
  ]);

  if (isObjectEmpty(modals)) {
    setModals();
  }

  return (
    <React.Fragment>
      {Object.entries(modals).map(([name, { open }]) => {
        if (!open) return null;

        const modalTmp = modalsDescriber[name];

        return <modalTmp.component key={name} />;
      })}
    </React.Fragment>
  );
};
