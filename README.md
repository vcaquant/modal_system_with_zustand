## Modal system with Zustand Setup

### Prerequisites

Ensure you have zustand. If not, install it:

```bash
npm i zustand
```

or

```bash
yarn add zustand
```

or

```bash
pnpm add zustand
```

### Step 1: Create Store

Create a file `modal.ts` in the `store` folder
(I install the `store` folder in `src/`)

```ts
// src/store/modal.ts

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
```

### Step 2: Create the modals describer

Create folder `modals` in your `components` directory and create `modalsDescriber.ts`

```ts
// components/modals/modalsDescriber.ts

import { ExampleModal, ExampleModalDescription } from "@/app/ExampleModal";

export interface ModalDescription {
  name: string;
  state: any;
  promiseBased: boolean;
  component: React.FC<any>;
}

let modals: { [name: string]: ModalDescription } = {};

const registerModal = (modal: any, description: any) => {
  const desc = description;

  modals[desc.name] = {
    name: desc.name,
    promiseBased: desc.promiseBased,
    state: {
      ...desc.defaultProps,
    },
    component: modal,
  };
};

registerModal(ExampleModal, ExampleModalDescription);

export { modals };
```

### Step 3: Create Modals Container

Create in the same folder as modalsDescriber: `ModalsContainer.tsx`:

```tsx
// components/modals/ModalsContainer.tsx

"use client";

import React from "react";
import { modals as modalsDescriber } from "./modalsDescriber";
import { useModalStore } from "@/src/stores/modal";

function isObjectEmpty(obj: Object) {
  return Object.keys(obj).length === 0;
}

export const ModalsContainer = (props: any) => {
  const [modals, setModals] = useModalStore((state) => [
    state.modals,
    state.setModals,
  ]);

  if (isObjectEmpty(modals)) {
    setModals();
  }

  return (
    <React.Fragment>
      {Object.entries(modals).map(([name, { open, ...otherProps }]) => {
        if (!open) return null;

        const modalTmp = modalsDescriber[name];

        return <modalTmp.component key={name} />;
      })}
    </React.Fragment>
  );
};
```

### Step 4: Create your modals

Your ready to create your modals! I'm using eg.[shadcn/ui](https://ui.shadcn.com/docs/installation) eg.[Dialog](https://ui.shadcn.com/docs/components/dialog)

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/src/stores/modal";
import { useCallback } from "react";

const ExampleModal = () => {
  const [modalStore, setOpenModal] = useModalStore((state) => [
    state.modals.ExampleModal,
    state.setOpenModal,
  ]);

  const close = useCallback(() => {
    if (modalStore.open) {
      setOpenModal("ExampleModal", false);
    }
  }, [modalStore, setOpenModal]);

  const resolve = useCallback(() => {
    modalStore.resolve();
    close();
  }, [modalStore, close]);

  const reject = useCallback(() => {
    modalStore.reject();
    close();
  }, [modalStore, close]);

  return (
    <Dialog open={modalStore.open} onOpenChange={reject}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between">
            Example Modal
          </DialogTitle>
          <DialogDescription>It&apos;s a Promise Modal</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"secondary"} onClick={reject}>
            Reject
          </Button>
          <Button onClick={resolve}>Resolve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const modalDescription = {
  name: "ExampleModal",
  isPromiseBased: true,
  defaultProps: {},
};

export { ExampleModal, modalDescription as ExampleModalDescription };
```

and in your main file you can call the modal like this:

```tsx
const openModal = useCallback(async () => {
  try {
    await setOpenModal("ExampleModal", true);
    toast.success("Modal Resolved");
  } catch (error) {
    toast.error("Modal Rejected");
  }
}, [setOpenModal]);
```

For the try/catch you have to set isPromised to true in modalDescription in your modal file.

### Step 4: Run your app

```bash
npm run dev
```

or

```bash
yarn dev
```

or

```bash
pnpm dev
```

#### Thank you
