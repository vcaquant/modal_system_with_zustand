"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModalStore } from "@/src/stores/modal";

export const ExampleComponent = () => {
  const { setOpenModal } = useModalStore((state) => state);

  const openModal = useCallback(async () => {
    try {
      await setOpenModal("ExampleModal", true);
      toast.success("Modal Resolved");
    } catch (error) {
      console.error(error);
      toast.error("Modal Rejected");
    }
  }, [setOpenModal]);

  return (
    <div className="mt-20 flex flex-1">
      <Card className="flex w-full max-w-xl flex-col items-center p-20">
        <Button
          onClick={openModal}
          className="rounded bg-primary p-4 text-white"
        >
          Open Modal
        </Button>
      </Card>
    </div>
  );
};
