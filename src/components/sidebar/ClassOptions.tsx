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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { SelectingStates, useDataStore } from "@/data/store";
import { useRouter } from "next/navigation";
import ClassForm, {
  ClassFormData,
  ClassFormSchema,
  ClassFormType,
} from "./ClassForm";
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
import { publishClassInput } from "@/server/authorized-queries";
import { useNextStep } from "nextstepjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

enum WhichDialog {
  EDIT,
  PUBLISH,
}

export default function ClassOptions(params: {
  existingClassId: string;
  publishClass: (data: publishClassInput) => Promise<string | undefined>;
}) {
  const { existingClassId, publishClass } = params;
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

  const submitEdit = (
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
      selectedBucketId: null,
      selectedAssignment: null,
      targetGrade: 90,
      published: existingClass.published,
    });

    // update default values for the form
    form.reset({
      courseName: formData.courseName,
      courseNumber: formData.courseNumber,
      buckets: formData.buckets,
    });

    setOpen(false);

    router.push(`/class/${existingClass.id}`);
  };

  const setTourStatus = useDataStore((store) => store.setTourStatus);

  const submitPublish = async (
    formData: ClassFormData,
    event: BaseSyntheticEvent<object, any, any> | undefined,
  ) => {
    event?.preventDefault();

    if (!formData.publishInfo) {
      throw new Error("No publish info");
    }

    // Get the current class data directly from the store
    const currentClass = useDataStore.getState().classes[existingClassId];

    if (!currentClass) {
      throw new Error("Class not found");
    }

    // Create the data to send using the current class data, not form data
    const dataToSend: publishClassInput = {
      name: currentClass.name,
      number: currentClass.number,
      weights: currentClass.weights,
      university: formData.publishInfo.university,
    };

    // Only use form data for publishing options
    if (formData.publishInfo.includeAssignments) {
      // Keep assignment details but reset scores
      dataToSend.weights = dataToSend.weights.map((bucket) => ({
        ...bucket,
        assignments: bucket.assignments.map((assignment) => ({
          id: assignment.id,
          name: assignment.name,
          outOf: assignment.outOf,
          score: 0,
          simulated: false,
        })),
      }));
    } else {
      // strip out all assignments
      dataToSend.weights = dataToSend.weights.map((bucket) => ({
        ...bucket,
        assignments: [],
      }));
    }

    const publishedId = await publishClass(dataToSend);

    if (publishedId) {
      editClass(existingClass.id, {
        ...existingClass,
        published: true,
      });

      if (currentTour === "publish-tour") {
        setTourStatus("publish-tour", true);
      }

      form.reset();
      setOpen(false);

      router.push(`/class-template/${publishedId}`);
    }
  };

  const deleteClass = useDataStore((state) => state.deleteClass);

  const { status } = useSession();

  const [whichDialogToShow, setWhichDialogToShow] = useState<WhichDialog>(
    WhichDialog.EDIT,
  );

  const { currentStep, currentTour, closeNextStep } = useNextStep();

  const handleDeleteKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Prevent default behavior (like triggering the cancel button)
      event.preventDefault();
      // Perform the delete action
      deleteClass(existingClass.id);
      // Close the dialog
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="h-full">
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (open == false) {
            closeNextStep();
            form.reset();
          }
        }}
      >
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) {
              if (currentStep == 2 && currentTour == "sidebar-tour") {
                closeNextStep();
              }
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="start" className="w-[100px]">
            <DialogTrigger
              className="w-full"
              onClick={() => setWhichDialogToShow(WhichDialog.EDIT)}
            >
              <DropdownMenuItem>
                <span>Edit Class</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger
                    className="w-full"
                    disabled={
                      existingClass.published || status !== "authenticated"
                    }
                    onClick={() => setWhichDialogToShow(WhichDialog.PUBLISH)}
                  >
                    <DropdownMenuItem
                      disabled={
                        existingClass.published || status !== "authenticated"
                      }
                    >
                      <span>Publish Class</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </TooltipTrigger>

                  {existingClass.published ? (
                    <TooltipContent>
                      <P>This class was already published</P>
                    </TooltipContent>
                  ) : status !== "authenticated" ? (
                    <TooltipContent>
                      <P>You have to log in to publish</P>
                    </TooltipContent>
                  ) : (
                    <></>
                  )}
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              <span>Delete Class</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {(() => {
          switch (whichDialogToShow) {
            case WhichDialog.EDIT:
              return (
                <DialogContent
                  className="z-50w-full max-w-[700px] overflow-y-scroll max-h-screen"
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Edit Existing Class
                    </DialogTitle>
                  </DialogHeader>
                  <ClassForm
                    form={form}
                    submit={submitEdit}
                    formType={ClassFormType.EDIT}
                  />
                </DialogContent>
              );
            case WhichDialog.PUBLISH:
              return (
                <DialogContent
                  className="z-50w-full max-w-[700px] overflow-y-scroll max-h-screen"
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Publish Class
                    </DialogTitle>
                  </DialogHeader>
                  <ClassForm
                    form={form}
                    submit={submitPublish}
                    formType={ClassFormType.PUBLISH}
                  />
                </DialogContent>
              );
          }
        })()}
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onKeyDown={handleDeleteKeyDown}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete {existingClass.name}?
            </AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
              <P>
                This will delete the class and all its buckets and assignments
                from your browser.
              </P>
              {status === "authenticated" && (
                <P>
                  This class will not be deleted from your personal cloud sync
                  until you Save Changes. If you published the class, that
                  template will not be deleted and will remain public.
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
