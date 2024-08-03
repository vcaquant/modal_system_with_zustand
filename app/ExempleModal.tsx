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

const ExempleModal = () => {
  const [modalStore, setOpenModal] = useModalStore((state) => [
    state.modals.ExempleModal,
    state.setOpenModal,
  ]);

  const close = useCallback(() => {
    if (modalStore.open) {
      setOpenModal("ExempleModal", false);
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
            Exemple Modal
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
  name: "ExempleModal",
  isPromiseBased: true,
  defaultProps: {},
};

export { ExempleModal, modalDescription as ExempleModalDescription };
