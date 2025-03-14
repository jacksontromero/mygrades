"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultBucket, SelectingStates, useDataStore } from "@/data/store";
import { useRouter } from "next/navigation";
import ClassForm, {
  ClassFormData,
  ClassFormSchema,
  ClassFormType,
} from "../ClassForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNextStep } from "nextstepjs";
import { usePathname } from 'next/navigation'

// pass searchClassesContent as a prop so it can be server-side rendered
export default function AddClassClient({
  searchClassesContent,
}: {
  searchClassesContent: React.ReactNode;
}) {
  const numClasses = useDataStore(
    useShallow((state) => Object.keys(state.classes).length),
  );

  const has_hydrated = useDataStore((state) => state._hasHydrated);

  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (has_hydrated) {
      // only do this on non-class-template pages
      if (!pathname.includes("/class-template")) {
        setOpen(numClasses === 0);
      }
    }
  }, [numClasses, has_hydrated, pathname]);

  const addClass = useDataStore((state) => state.addClass);

  const form = useForm<ClassFormData>({
    resolver: async (data, context, options) => {
      return zodResolver(ClassFormSchema)(data, context, options);
    },
    mode: "onSubmit",
    defaultValues: {
      courseName: "",
      courseNumber: "",
      buckets: [defaultBucket()],
    },
  });

  const router = useRouter();

  const submit: SubmitHandler<ClassFormData> = (
    formData: ClassFormData,
    event: BaseSyntheticEvent<object, any, any> | undefined,
  ) => {
    event?.preventDefault();

    const newID = uuidv4();

    addClass({
      id: newID,
      name: formData.courseName,
      number: formData.courseNumber,
      weights: formData.buckets,
      selectingState: SelectingStates.FIRST_LOAD,
      selectedBucket: null,
      selectedAssignment: null,
      targetGrade: 90,
      published: false,
    });

    form.reset();
    setOpen(false);

    router.push(`/class/${newID}`);
  };

  const { startNextStep, closeNextStep } =
    useNextStep();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        startNextStep("welcome-tour");
      }, 500);
    } else {
      closeNextStep();
    }
  }, [open, startNextStep, closeNextStep]);

  const [tab, setTab] = useState("createClass");

  return (
    <div className="flex justify-center">
      <SidebarMenuButton asChild>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            if (!open) {
              closeNextStep();
            }
            setOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(true);
              }}
              className="my-2"
            >
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent
            id="add-class-dialog"
            className="w-full max-w-[800px]"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Add a New Class
              </DialogTitle>
            </DialogHeader>
            <Tabs
              defaultValue="createClass"
              value={tab}
              onValueChange={(v) => {
                setTab(v);

                setTimeout(() => {
                  if (v === "createClass") {
                    startNextStep("create-class-tour");
                  } else {
                    startNextStep("search-class-tour");
                  }
                }, 50);
              }}
            >
              <TabsList id="add-class-tabs">
                <TabsTrigger value="createClass">Create a Class</TabsTrigger>
                <TabsTrigger value="searchClass">
                  Search for a Class
                </TabsTrigger>
              </TabsList>
              <TabsContent value="createClass" className="">
                <ClassForm
                  form={form}
                  submit={submit}
                  formType={ClassFormType.CREATE}
                />
              </TabsContent>
              <TabsContent value="searchClass" className="">
                {searchClassesContent}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </SidebarMenuButton>
    </div>
  );
}
