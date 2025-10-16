/* eslint-disable no-fallthrough */
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { modals } from "@/components/modals/modalsDescriber";

type Store = {
  modals: Modals;
  currentModalsOpen: string[];
  setOpenModal: (
    modalName: string,
    open: boolean,
    modalState?: any
  ) => Promise<unknown> | undefined;
  setResetModal: (modalName: string) => void;
  setModals: () => void;
};

export type Modals = {
  [key: string]: {
    open: boolean;
    modalName: string;
    component: React.FC;
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
    state: any;
  };
};

export const useModalStore = create<Store>()(
  devtools((set) => ({
    modals: {},
    currentModalsOpen: [],
    setOpenModal: (modalName, open, modalState = {}) => {
      const modalDescription = modals[modalName];
      const { promiseBased } = modalDescription;
      const defaultProps = {
        ...modalDescription.state,
        ...modalState,
      };

      switch (true) {
        case !open:
          set((state) => {
            const currentModalsOpen = state.currentModalsOpen.filter(
              (modal) => modal !== modalName
            );

            return {
              currentModalsOpen: currentModalsOpen,
              modals: {
                ...state.modals,
                [modalName]: {
                  ...state.modals[modalName],
                  open: false,
                  state: {},
                },
              },
            };
          });
        case !promiseBased:
          set((state) => {
            const currentModalsOpen =
              open && !state.currentModalsOpen.includes(modalName)
                ? [...state.currentModalsOpen, modalName]
                : state.currentModalsOpen;

            const modalsUpdate = {
              ...state.modals,
              [modalName]: {
                ...state.modals[modalName],
                open: open,
                state: open ? defaultProps : state.modals[modalName].state,
              },
            };

            return {
              currentModalsOpen: currentModalsOpen,
              modals: modalsUpdate,
            };
          });
        default:
          return new Promise((resolve, reject) => {
            set((state) => {
              const existingModal = state.modals[modalName];
              const modalToUpdate = existingModal || {
                open: false,
                modalName: modalName,
                component: modalDescription.component,
                state: {},
                resolve: () => {},
                reject: () => {},
              };

              const currentModalsOpen =
                open && !state.currentModalsOpen.includes(modalName)
                  ? [...state.currentModalsOpen, modalName]
                  : state.currentModalsOpen;

              const modalsUpdate = {
                ...state.modals,
                [modalName]: {
                  ...modalToUpdate,
                  open: open,
                  resolve: resolve,
                  reject: reject,
                  state: open ? defaultProps : modalToUpdate.state,
                },
              };

              return {
                modals: modalsUpdate,
                currentModalsOpen: currentModalsOpen,
              };
            });
          });
      }
    },
    setResetModal: (modalName: string) =>
      set((state) => {
        const currentModalsOpen = state.currentModalsOpen.filter(
          (modal) => modal !== modalName
        );

        const modalsUpdate = {
          ...state.modals,
          [modalName]: {
            ...state.modals[modalName],
            open: false,
            state: {},
          },
        };

        return {
          modals: modalsUpdate,
          currentModalsOpen: currentModalsOpen,
        };
      }),
    setModals: () =>
      set(() => {
        return {
          modals: Object.keys(modals).reduce(
            (acc: Modals, modalName: string) => {
              acc[modalName] = {
                open: false,
                modalName: modalName,
                component: modals[modalName].component,
                state: modals[modalName].state,
                resolve: () => {},
                reject: () => {},
              };
              return acc;
            },
            {} as Modals
          ),
        };
      }),
  }))
);
