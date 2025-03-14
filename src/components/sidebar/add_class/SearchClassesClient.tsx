"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RetunredCourseInfo } from "./AddClass";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, Plus, Users, ExternalLink } from "lucide-react";
import { P } from "@/components/ui/typography";
import { SelectingStates, useDataStore } from "@/data/store";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import SearchUniversities from "./SearchUniversities";
import { useNextStep } from "nextstepjs";

export function SearchClassesClient({
  search,
  increaseNumUsers,
}: {
  search: (
    query: string,
    university: string | null,
  ) => Promise<RetunredCourseInfo>;
  increaseNumUsers: (classId: string) => Promise<void>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RetunredCourseInfo>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUni, setSelectedUni] = useState<string | null>(null);

  const { currentStep, setCurrentStep, closeNextStep, currentTour } = useNextStep();

  const handleSearch = async () => {
    if (searchQuery.length === 0) {
      return;
    }

    setIsLoading(true);

    const results = await search(searchQuery, selectedUni);
    setSearchResults(results);

    setIsLoading(false);

    if (currentTour === "search-class-tour") {
      setCurrentStep(currentStep + 1);
    }
  };

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
        <Input
          type="text"
          placeholder="Search courses"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchUniversities
          selectedUni={selectedUni}
          setSelectedUni={setSelectedUni}
          buttonText="Filter By University"
          showAddButton={false}
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
                      <p className="text-sm text-muted-foreground">
                        Created on {course.createdAt.toLocaleDateString()}
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
                              onClick={() => window.open(`/class-template/${course.id}`, '_blank')}
                            >
                              <ExternalLink size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Inspect class template</p>
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
            </ul>
          ) : (
            <p className="text-muted-foreground">No results found</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
