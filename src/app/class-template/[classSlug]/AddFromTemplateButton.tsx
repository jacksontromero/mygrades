"use client";

import { SelectingStates, useDataStore } from "@/data/store";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useNextStep } from "nextstepjs";
import { Button } from "@/components/ui/button";
import { publishedClassType } from "@/server/unauthorized-queries";
import { PlusIcon } from "lucide-react";

export default function AddFromTemplateButton(params: {
  serverData: NonNullable<publishedClassType>;
}) {
  const { serverData } = params;

  const addClass = useDataStore((state) => state.addClass);
  const router = useRouter();

  const { closeNextStep } = useNextStep();

  const handleAddClass = () => {
    const newID = uuidv4();

    addClass({
      id: newID,
      name: serverData.name,
      number: serverData.number,
      weights: serverData.weights,
      selectingState: SelectingStates.FIRST_LOAD,
      selectedBucket: null,
      selectedAssignment: null,
      targetGrade: 90,
      published: true,
    });

    closeNextStep();

    router.push(`/class/${newID}`);
  };

  return (
    <Button
      size="lg"
      className="group gap-2 px-4 py-2 font-medium transition-all hover:bg-primary/90"
      onClick={handleAddClass}
    >
      <PlusIcon size={18} className="transition-transform group-hover:rotate-90" />
      <span>Add to My Classes</span>
    </Button>
  );
}
