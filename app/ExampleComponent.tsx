"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModalStore } from "@/src/stores/modal";
import { useCallback } from "react";
import { toast } from "sonner";

export const ExampleComponent = () => {
  const { setOpenModal } = useModalStore((state) => state);

  const openModal = useCallback(async () => {
    try {
      await setOpenModal("ExampleModal", true);
      toast.success("Modal Resolved");
    } catch (error) {
      toast.error("Modal Rejected");
    }
  }, [setOpenModal]);

  return (
    <div className="flex flex-1 mt-20">
      <Card className="w-full max-w-xl flex flex-col items-center p-20">
        <Button
          onClick={openModal}
          className="p-4 bg-primary text-white rounded"
        >
          Open Modal
        </Button>
      </Card>
    </div>
  );
};
