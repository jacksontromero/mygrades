"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RetunredCourseInfo } from "./AddClass";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, HelpCircle, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { P } from "@/components/ui/typography";
import { SelectingStates, useDataStore } from "@/data/store";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SearchUniversities from "./SearchUniversities";
import { useNextStep } from "nextstepjs";

type SearchType = "name" | "number";

export function SearchClassesClient({
  searchName,
  searchNumber,
  increaseNumUsers,
  reportInaccurate,
  reportedInaccurateClasses,
}: {
  searchName: (
    name: string,
    university: string | null,
  ) => Promise<RetunredCourseInfo>;
  searchNumber: (
    number: string,
    university: string | null,
  ) => Promise<RetunredCourseInfo>;
  increaseNumUsers: (classId: string) => Promise<void>;
  reportInaccurate: (classId: string) => Promise<void>;
  reportedInaccurateClasses: Set<string>;
}) {
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RetunredCourseInfo>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUni, setSelectedUni] = useState<string | null>(null);

  const { status } = useSession();

  const { currentStep, setCurrentStep, closeNextStep } = useNextStep();

  const handleSearch = async () => {
    if (searchQuery.length === 0) {
      return;
    }

    setIsLoading(true);

    if (searchType === "name") {
      const results = await searchName(searchQuery, selectedUni);
      setSearchResults(results);
    } else {
      const results = await searchNumber(searchQuery, selectedUni);
      setSearchResults(results);
    }

    setIsLoading(false);

    setCurrentStep(currentStep + 1);
  };

  const [selectedCourse, setSelectedCourse] = useState<
    RetunredCourseInfo[0] | null
  >(null);

  const addClass = useDataStore((state) => state.addClass);
  const router = useRouter();

  const handleInspectClass = (serverData: RetunredCourseInfo[0]) => {
    setSelectedCourse(serverData);
    closeNextStep();
  };

  const handleAddClass = (serverData: RetunredCourseInfo[0]) => {
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
    <div className="flex w-full max-w-3xl">
      <div
        className="flex w-1/3 flex-col space-y-4 p-4"
        id="search-filters-container"
      >
        <RadioGroup
          defaultValue="name"
          onValueChange={(value) => setSearchType(value as SearchType)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="name" />
            <Label htmlFor="name">Search by Course Name</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="number" id="number" />
            <Label htmlFor="number">Search by Course Number</Label>
          </div>
        </RadioGroup>
        <SearchUniversities
          selectedUni={selectedUni}
          setSelectedUni={setSelectedUni}
          buttonText="Filter By University"
          showAddButton={false}
        />
        <Input
          type="text"
          placeholder={`Enter course ${searchType}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading || searchQuery.length === 0}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
        <div className="flex h-full grow flex-col justify-end text-sm text-muted-foreground">
          <p className="h-auto">
            {`To publish your own class, create it locally, click "..." in the
            sidebar, and then click "Publish Class"`}
          </p>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="ml-2 w-2/3 p-2" id="search-results-container">
        <h3 className="mb-2 text-lg font-semibold">Search Results</h3>
        <ScrollArea className="h-[320px]">
          {searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((course) => (
                <li key={course.id} className="rounded-md bg-secondary p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.number}, {course.university}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex w-[36px] flex-col gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="h-4 w-4" />
                                <span>{course.numUsers}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Number of users</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-sm">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <span className="text-destructive">
                                  {course.numInaccurateReports}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Number of times reported inaccurate</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleInspectClass(course)}
                            >
                              <HelpCircle />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View grading schema</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                void increaseNumUsers(course.id);
                                handleAddClass(course);
                              }}
                            >
                              <Plus className="text-primary" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <P>Add Class</P>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </li>
              ))}

              <Dialog
                open={!!selectedCourse}
                onOpenChange={() => setSelectedCourse(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedCourse?.name} ({selectedCourse?.number})
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <h4 className="font-medium">Grading Schema</h4>
                    {selectedCourse?.weights.map((bucket) => (
                      <div
                        key={bucket.id}
                        className="rounded-md bg-secondary p-2"
                      >
                        <span className="font-medium">{bucket.name} - </span>
                        <span className="text-sm text-muted-foreground">
                          Weight: {bucket.percentage}%, {bucket.drops} drops
                        </span>
                      </div>
                    ))}
                    {status === "authenticated" ? (
                      <>
                        {!reportedInaccurateClasses.has(selectedCourse?.id!) ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline">
                                <div className="flex flex-row items-center gap-2">
                                  <AlertTriangle className="text-destructive" />
                                  <span className="text-destructive">
                                    Report Inaccurate Schema
                                  </span>
                                </div>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Report Inaccurate Schema
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. Please only
                                  report inaccurate schemas if you are sure that
                                  this schema is inaccurate. It is encouraged
                                  that you publish a corrected version.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-primary hover:bg-destructive"
                                  onClick={async () => {
                                    await reportInaccurate(selectedCourse?.id!);
                                    setSearchResults((prev) => {
                                      return prev.map((x) => {
                                        if (x.id === selectedCourse?.id) {
                                          return {
                                            ...x,
                                            numInaccurateReports:
                                              x.numInaccurateReports + 1,
                                          };
                                        } else {
                                          return x;
                                        }
                                      });
                                    });
                                    // refresh causes button to change to "You have already reported this class"
                                    router.refresh();
                                  }}
                                >
                                  Report
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button variant="outline" disabled={true}>
                            <div className="flex flex-row items-center gap-2">
                              <AlertTriangle className="text-destructive" />
                              <span className="text-destructive">
                                You Have Already Reported This Class
                              </span>
                            </div>
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="outline" disabled={true}>
                        <div className="flex flex-row items-center gap-2">
                          <AlertTriangle className="text-destructive" />
                          <span className="text-destructive">
                            Log In To Report Inaccurate Schema
                          </span>
                        </div>
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </ul>
          ) : (
            <p className="text-muted-foreground">No results found</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
