"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CloudUpload, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { bucket, defaultBucket } from "@/data/store";
import { Switch } from "../ui/switch";
import SearchUniversities from "./add_class/SearchUniversities";
import { P } from "../ui/typography";
import { useNextStep } from "nextstepjs";
import { useEffect } from "react";

export const ClassFormSchema = z.object({
  courseName: z.string().min(1).max(255),
  courseNumber: z.string().min(1).max(255),
  buckets: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        percentage: z.coerce.number().min(0).max(100),
        drops: z.coerce.number().min(0),
        assignments: z.array(
          z.object({
            id: z.string().min(1),
            name: z.string().min(0),
            score: z.coerce.number().min(0).max(100),
            outOf: z.number().min(0),
            simulated: z.boolean(),
          }),
        ),
      }) satisfies z.ZodType<bucket>,
    )
    .refine(
      (buckets) =>
        buckets.reduce((sum, x) => sum + Number(x.percentage), 0) === 100,
      {
        message: "The sum of all bucket weights must be 100%",
        path: ["refine"],
      },
    ),
  publishInfo: z
    .object({
      includeAssignments: z.boolean().default(false),
      university: z.string().max(255),
    })
    .optional(),
});

export type ClassFormData = z.infer<typeof ClassFormSchema>;

export enum ClassFormType {
  CREATE,
  EDIT,
  PUBLISH,
}

export default function ClassForm(params: {
  form: UseFormReturn<ClassFormData, any, undefined>;
  submit: SubmitHandler<ClassFormData>;
  formType: ClassFormType;
}) {
  const { form, submit, formType } = params;

  const bucketsSum = form
    .watch("buckets")
    .reduce((sum, x) => sum + Number(x.percentage), 0);

  const { fields, append, remove } = useFieldArray({
    name: "buckets",
    control: form.control,
  });

  const { startNextStep, setCurrentStep, currentTour } = useNextStep();

  useEffect(() => {
    if (formType === ClassFormType.PUBLISH) {
      setTimeout(() => {
        startNextStep("publish-tour");
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (bucketsSum === 100 && formType === ClassFormType.CREATE) {
      setCurrentStep(2);
    }
  }, [bucketsSum]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} id="publish-target">
        <div className="mt-2 flex flex-row items-start gap-8">
          <div className="flex flex-col gap-2" id="class-info-container">
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="Imperative Computation"
                      onFocus={() => {
                        if (
                          currentTour != "create-class-tour" &&
                          formType === ClassFormType.CREATE
                        ) {
                          startNextStep("create-class-tour");
                        }
                        // else {
                        //   setCurrentStep(0);
                        // }
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Number</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="15-122"
                      onFocus={() => {
                        if (
                          currentTour != "create-class-tour" &&
                          formType === ClassFormType.CREATE
                        ) {
                          startNextStep("create-class-tour");
                        }
                        // else {
                        //   setCurrentStep(0);
                        // }
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2" id="weights-container">
            <FormLabel className="mt-2">Weights</FormLabel>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <div className="flex flex-row gap-1">
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name={`buckets.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                required
                                type="text"
                                placeholder="Homework"
                                onFocus={() => {
                                  if (
                                    currentTour != "create-class-tour" &&
                                    formType === ClassFormType.CREATE
                                  ) {
                                    startNextStep("create-class-tour");
                                  }
                                  // else {
                                  //   setCurrentStep(1);
                                  // }
                                }}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="ml-1">
                              Bucket Name
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/4">
                      <FormField
                        control={form.control}
                        name={`buckets.${index}.percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                required
                                type="number"
                                min={0}
                                max={100}
                                onWheel={(e) =>
                                  (e.target as HTMLElement).blur()
                                }
                                onFocus={() => {
                                  if (
                                    currentTour != "create-class-tour" &&
                                    formType === ClassFormType.CREATE
                                  ) {
                                    startNextStep("create-class-tour");
                                  }
                                  // else {
                                  //   setCurrentStep(1);
                                  // }
                                }}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="ml-1">
                              Percentage
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/4">
                      <FormField
                        control={form.control}
                        name={`buckets.${index}.drops`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                required
                                type="number"
                                min={0}
                                onWheel={(e) =>
                                  (e.target as HTMLElement).blur()
                                }
                                onFocus={() => {
                                  if (
                                    currentTour != "create-class-tour" &&
                                    formType === ClassFormType.CREATE
                                  ) {
                                    startNextStep("create-class-tour");
                                  }
                                  // else {
                                  //   setCurrentStep(1);
                                  // }
                                }}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="ml-1">
                              Drops
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          className="-mt-7"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon className="text-destructive" size={20} />
                        </TooltipTrigger>
                        <TooltipContent className="-mb-5">
                          <p>Delete this bucket</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between gap-1 pt-2">
              <Button
                onClick={() => {
                  append(defaultBucket());
                }}
                type="button"
                variant="outline"
              >
                Add Bucket
              </Button>
            </div>
          </div>
        </div>
        <Separator className="mx-2 my-4"></Separator>
        <div className="flex flex-col items-center gap-2 text-center">
          {bucketsSum != 100 && (
            <p role="alert" className="text-sm font-bold text-destructive">
              The sum of all bucket weights must be 100%
            </p>
          )}
          {(() => {
            switch (formType) {
              case ClassFormType.CREATE:
                return (
                  <Button
                    id="add-class-button-form-button"
                    className="max-w-md"
                    type="submit"
                    disabled={bucketsSum != 100}
                  >
                    Add Class
                  </Button>
                );
              case ClassFormType.EDIT:
                return (
                  <Button
                    className="max-w-md"
                    type="submit"
                    disabled={bucketsSum != 100}
                  >
                    Save Changes
                  </Button>
                );
              case ClassFormType.PUBLISH:
                return (
                  <div>
                    <div className="flex min-h-full flex-row items-center gap-2">
                      <div>
                        <FormField
                          control={form.control}
                          name="publishInfo.includeAssignments"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-row items-center gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <FormLabel className="cursor-pointer">
                                        Include Assignments
                                      </FormLabel>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <P>
                                        {`Include each assignment's name and
                                        score-out-of in the published class.`}
                                      </P>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <Separator orientation="vertical" className="h-[36px]" />
                      <FormField
                        control={form.control}
                        name="publishInfo.university"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SearchUniversities
                                selectedUni={field.value}
                                setSelectedUni={field.onChange}
                                buttonText="Select University"
                                showAddButton={true}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      className="mt-4 max-w-md"
                      type="submit"
                      disabled={
                        bucketsSum != 100 ||
                        !form.watch("publishInfo.university")
                      }
                    >
                      <CloudUpload />
                      <span>Publish Class</span>
                    </Button>
                  </div>
                );
            }
          })()}
        </div>
      </form>
    </Form>
  );
}
