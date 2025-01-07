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
import {
  AlertTriangle,
  ChevronsUpDown,
  HelpCircle,
  Plus,
  Users,
  X,
} from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSession } from "next-auth/react";

type SearchType = "name" | "number";

export function SearchClassesClient({
  searchName,
  searchNumber,
  increaseNumUsers,
  reportInaccurate,
  reportedInaccurateClasses,
  allUniversities,
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
  allUniversities: string[];
}) {
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RetunredCourseInfo>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUni, setSelectedUni] = useState<string | null>(null);

  const { status } = useSession();

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
  };

  const [selectedCourse, setSelectedCourse] = useState<
    RetunredCourseInfo[0] | null
  >(null);

  const addClass = useDataStore((state) => state.addClass);
  const router = useRouter();

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
    });

    router.push(`/class/${newID}`);
  };

  return (
    <div className="flex w-full max-w-3xl">
      <div className="w-1/3 space-y-4 p-4">
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
          allUniversities={allUniversities}
          selectedUni={selectedUni}
          setSelectedUni={setSelectedUni}
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
      </div>
      <Separator orientation="vertical" />
      <div className="w-2/3 p-2">
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
                        {course.semester ? `, ${course.semester}` : ""}
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
                              onClick={() => setSelectedCourse(course)}
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
                              onClick={() => {
                                increaseNumUsers(course.id);
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
                              <Button
                                variant="outline"
                                onClick={() => {
                                  reportInaccurate(selectedCourse?.id!);
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
                                <AlertDialogAction className="bg-destructive">
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

function SearchUniversities({
  allUniversities,
  selectedUni,
  setSelectedUni,
}: {
  allUniversities: string[];
  selectedUni: string | null;
  setSelectedUni: (uni: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <div className="flex flex-row items-center justify-start gap-2">
              {selectedUni ? (
                <span>{selectedUni}</span>
              ) : (
                <>Filter By University...</>
              )}
              <ChevronsUpDown className="opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <UniList
            allUniversities={allUniversities}
            setOpen={setOpen}
            selectedUni={selectedUni}
            setSelectedUni={setSelectedUni}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedUni ? (
            <>{selectedUni}</>
          ) : (
            <>
              Filter By University... <ChevronsUpDown className="opacity-50" />
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <UniList
            allUniversities={allUniversities}
            setOpen={setOpen}
            selectedUni={selectedUni}
            setSelectedUni={setSelectedUni}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function UniList({
  allUniversities,
  setOpen,
  selectedUni,
  setSelectedUni,
}: {
  allUniversities: string[];
  setOpen: (open: boolean) => void;
  selectedUni: string | null;
  setSelectedUni: (uni: string | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter Universities..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {selectedUni && (
            <CommandItem
              key="select none at all"
              value="Deselect"
              onSelect={() => {
                setSelectedUni(null);
                setOpen(false);
              }}
            >
              <X className="h-4 w-4" />
              Deselect
            </CommandItem>
          )}
          {allUniversities.map((uni) => (
            <CommandItem
              key={uni}
              value={uni}
              onSelect={(value) => {
                setSelectedUni(uni);
                setOpen(false);
              }}
            >
              {uni}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
