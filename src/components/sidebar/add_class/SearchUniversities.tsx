"use client";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { SharedDataContext } from "../SharedContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SearchUniversities({
  selectedUni,
  setSelectedUni,
  buttonText,
  showAddButton,
}: {
  selectedUni: string | null;
  setSelectedUni: (uni: string | null) => void;
  buttonText: string;
  showAddButton: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const allUniversities = useContext(SharedDataContext).allUniversities;

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <div className="overflow-hidden">
                {selectedUni ? <span>{selectedUni}</span> : <>{buttonText}</>}
              </div>
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
            showAddButton={showAddButton}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <div className="overflow-hidden">
              {selectedUni ? <span>{selectedUni}</span> : <>{buttonText}</>}
            </div>
            <ChevronsUpDown className="opacity-50" />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="hidden">{buttonText}</DrawerTitle>
        <div className="mt-4 border-t">
          <UniList
            allUniversities={allUniversities}
            setOpen={setOpen}
            selectedUni={selectedUni}
            setSelectedUni={setSelectedUni}
            showAddButton={showAddButton}
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
  showAddButton,
}: {
  allUniversities: string[];
  setOpen: (open: boolean) => void;
  selectedUni: string | null;
  setSelectedUni: (uni: string | null) => void;
  showAddButton: boolean;
}) {
  const [newClassPopoverOpen, setNewClassPopoverOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  return (
    <Command>
      <CommandInput placeholder="Search Universities..." />
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
          {showAddButton && (
            <Popover
              open={newClassPopoverOpen}
              onOpenChange={setNewClassPopoverOpen}
            >
              <PopoverAnchor asChild>
                <CommandItem
                  key="add a new university"
                  value="Add"
                  onSelect={() => {
                    setNewClassPopoverOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </CommandItem>
              </PopoverAnchor>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Add New University
                    </h4>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="uni_name">Name</Label>
                      <Input
                        id="uni_name"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="University Name"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <Button
                      disabled={newClassName.length === 0}
                      onClick={() => {
                        setSelectedUni(newClassName);
                        setNewClassPopoverOpen(false);
                        setOpen(false);
                      }}
                    >
                      Save University Name
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {allUniversities.map((uni) => (
            <CommandItem
              key={uni}
              value={uni}
              onSelect={() => {
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
