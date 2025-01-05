"use client";

import { BaseSyntheticEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { SelectingStates, useDataStore } from "@/data/store";
import { useRouter } from "next/navigation";
import ClassForm, { ClassFormData, ClassFormSchema } from "./ClassForm";
import { useForm } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { SidebarMenuAction } from "../ui/sidebar";
import { useSession } from "next-auth/react";
import { P } from "../ui/typography";

export default function ClassOptions(params: { existingClassId: string }) {
  const { existingClassId } = params;
  const existingClass = useDataStore(
    (state) => state.classes[existingClassId],
  )!;
  const [open, setOpen] = useState(false);
  const editClass = useDataStore((state) => state.editClass);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(ClassFormSchema),
    mode: "onSubmit",
    defaultValues: {
      courseName: existingClass.name,
      courseNumber: existingClass.number,
      buckets: existingClass.weights,
    },
  });

  const router = useRouter();

  const submit = (
    formData: ClassFormData,
    event: BaseSyntheticEvent<object, any, any> | undefined,
  ) => {
    event?.preventDefault();

    editClass(existingClass.id, {
      id: existingClass.id,
      name: formData.courseName,
      number: formData.courseNumber,
      weights: formData.buckets,
      selectingState: SelectingStates.FIRST_LOAD,
      selectedBucket: null,
      selectedAssignment: null,
      targetGrade: 90,
    });

    form.reset();
    setOpen(false);

    router.push(`/class/${existingClass.id}`);
  };

  const deleteClass = useDataStore((state) => state.deleteClass);

  const { status } = useSession();

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (open == false) {
            form.reset();
          }
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem>
              <DialogTrigger>
                <span>Edit Class</span>
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              <span>Delete Class</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="z-50w-full max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Existing Class
            </DialogTitle>
          </DialogHeader>
          <ClassForm form={form} submit={submit} submitText="Save Changes" />
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete {existingClass.name}?
            </AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
              <P>
                This will delete the class and all its buckets and assignments
              </P>
              {status === "authenticated" && (
                <P>
                  Note: The class will not be deleted from the cloud until you
                  manually sync
                </P>
              )}
            </div>{" "}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteClass(existingClass.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
