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
  ) => Promise<unknown>;
  setResetModal: (modalName: string) => void;
  setModals: () => void;
};

export type Modals = {
  [key: string]: {
    open: boolean;
    modalName: string;
    component: React.FC<any>;
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
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
            const currentModalsOpen = (state.currentModalsOpen =
              state.currentModalsOpen.filter((modal) => modal !== modalName));

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
            const currentModalsOpen = state.currentModalsOpen;
            const storeModals = state.modals;

            storeModals[modalName].open = open;
            if (open && !currentModalsOpen.includes(modalName)) {
              currentModalsOpen.push(modalName);
              storeModals[modalName].state = defaultProps;
            }

            return {
              currentModalsOpen: currentModalsOpen,
              modals: storeModals,
            };
          });
        default:
          return new Promise((resolve, reject) => {
            set((state) => {
              const currentModalsOpen = state.currentModalsOpen;
              const storeModals = state.modals;

              if (!storeModals[modalName]) {
                storeModals[modalName] = {
                  open: false,
                  modalName: modalName,
                  component: modalDescription.component,
                  state: {},
                  resolve: () => {},
                  reject: () => {},
                };
              }

              storeModals[modalName].open = open;
              storeModals[modalName].resolve = resolve;
              storeModals[modalName].reject = reject;
              if (open && !currentModalsOpen.includes(modalName)) {
                currentModalsOpen.push(modalName);
                storeModals[modalName].state = defaultProps;
              }

              return {
                modals: storeModals,
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
        const storeModals = state.modals;
        storeModals[modalName].open = false;
        storeModals[modalName].state = {};

        return {
          modals: storeModals,
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
