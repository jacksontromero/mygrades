import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const CURRENT_SCHEMA_VERSION = 1;

export enum SelectingStates {
  FIRST_LOAD,
  SELECTED,
  SELECTING,
}

export type assignment = {
  name: string;
  score: number;
  outOf: number;
  id: string;
  simulated: boolean;
};

export type bucket = {
  name: string;
  percentage: number;
  drops: number;
  assignments: assignment[];
  id: string;
};

export type schoolClass = {
  name: string;
  number: string;
  weights: bucket[];
  id: string;
  selectingState: SelectingStates;
  selectedBucketId: string | null;
  selectedAssignment: assignment | null;
  targetGrade: number;
  published: boolean;
};

export type serverDataStore = {
  classes: Record<string, schoolClass>;
  schemaVersion: number;
  tourStatus: Record<string, boolean>;
};

export type globalDataStore = {
  schemaVersion: number;
  updateSchemaVersion: (newVersion: number) => void;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  classes: Record<string, schoolClass>;
  addClass: (newClass: schoolClass) => void;
  editClass: (classId: string, newClass: schoolClass) => void;
  resetSelectAssignment: (classId: string, newState: SelectingStates) => void;
  pickSelectedAssignment: (
    classId: string,
    a: assignment,
    bucketId: string,
  ) => void;
  setTargetGrade: (classId: string, newTarget: number) => void;
  addNewAssignment: (classId: string, bucketId: string) => void;
  removeAssignment: (
    classId: string,
    bucketId: string,
    assignmentId: string,
  ) => void;
  setAssignmentName: (
    classId: string,
    bucketId: string,
    a: assignment,
    newName: string,
  ) => void;
  setAssignmentScore: (
    classId: string,
    bucketId: string,
    a: assignment,
    newScore: number,
  ) => void;
  setAssignmentOutOf: (
    classId: string,
    bucketId: string,
    a: assignment,
    newOutOf: number,
  ) => void;
  simulateAssignment: (
    classId: string,
    bucketId: string,
    a: assignment,
  ) => void;
  deleteClass(classId: string): void;
  tourStatus: Record<string, boolean>;
  setTourStatus: (tourName: string, status: boolean) => void;
  resetTours: () => void;
};

export const defaultAssignment: () => assignment = () => ({
  name: "",
  score: 0,
  outOf: 100,
  simulated: false,
  id: uuidv4(),
});

export const defaultBucket: () => bucket = () => ({
  name: "",
  percentage: 0,
  drops: 0,
  assignments: [defaultAssignment()],
  id: uuidv4(),
});

export const useDataStore = create<globalDataStore>()(
  persist(
    immer((set) => ({
      classes: {} as Record<string, schoolClass>,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      updateSchemaVersion: (newVersion: number) =>
        set((state) => {
          state.schemaVersion = newVersion;
        }),
      _hasHydrated: false as boolean,
      setHasHydrated: (hasHydrated: boolean) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      addClass: (newClass: schoolClass) =>
        set((state) => {
          const existing = state.classes.hasOwnProperty(newClass.id);
          if (existing) {
            console.warn("Class already exists");
          } else {
            state.classes[newClass.id] = newClass;
          }
        }),

      editClass: (classId: string, newClass: schoolClass) =>
        set((state) => {
          const sameId = classId === newClass.id;
          if (!sameId) {
            console.warn("Class IDs do not match");
            return;
          } else {
            state.classes[classId] = newClass;
          }
        }),

      resetSelectAssignment: (classId: string, newState: SelectingStates) =>
        set((state) => {
          state.classes[classId]!.selectedAssignment = null;
          state.classes[classId]!.selectedBucketId = null;
          state.classes[classId]!.selectingState = newState;
        }),

      pickSelectedAssignment: (
        classId: string,
        a: assignment,
        bucketId: string,
      ) =>
        set((state) => {
          state.classes[classId]!.selectedAssignment = a;
          state.classes[classId]!.selectedBucketId = bucketId;
          state.classes[classId]!.selectingState = SelectingStates.SELECTED;
        }),

      setTargetGrade: (classId: string, newTarget: number) =>
        set((state) => {
          state.classes[classId]!.targetGrade = newTarget;
        }),

      addNewAssignment: (classId: string, bucketId: string) =>
        set((state) => {
          state.classes[classId]!.weights.find(
            (x) => x.id === bucketId,
          )!.assignments.push(defaultAssignment());
        }),

      removeAssignment: (
        classId: string,
        bucketId: string,
        assignmentId: string,
      ) =>
        set((state) => {
          const assignments = state.classes[classId]!.weights.find(
            (x) => x.id === bucketId,
          )!.assignments;
          assignments.splice(
            assignments.findIndex((x) => x.id === assignmentId),
            1,
          );
        }),

      setAssignmentName: (
        classId: string,
        bucketId: string,
        a: assignment,
        newName: string,
      ) =>
        set((state) => {
          state.classes[classId]!.weights.find(
            (x) => x.id === bucketId,
          )!.assignments.find((x) => x.id === a.id)!.name = newName;
        }),

      setAssignmentScore: (
        classId: string,
        bucketId: string,
        a: assignment,
        newScore: number,
      ) =>
        set((state) => {
          state.classes[classId]!.weights.find(
            (x) => x.id === bucketId,
          )!.assignments.find((x) => x.id === a.id)!.score = newScore;
        }),
      setAssignmentOutOf: (
        classId: string,
        bucketId: string,
        a: assignment,
        newOutOf: number,
      ) =>
        set((state) => {
          state.classes[classId]!.weights.find(
            (x) => x.id === bucketId,
          )!.assignments.find((x) => x.id === a.id)!.outOf = newOutOf;
        }),
      simulateAssignment: (classId: string, bucketId: string, a: assignment) =>
        set((state) => {
          state.classes[classId]!.weights.find(
            (x) => x.id === bucketId,
          )!.assignments.find((x) => x.id === a.id)!.simulated = !a.simulated;
        }),
      deleteClass: (classId: string) =>
        set((state) => {
          delete state.classes[classId];
        }),
      tourStatus: {} as Record<string, boolean>,
      setTourStatus: (tourName: string, status: boolean) =>
        set((state) => {
          state.tourStatus[tourName] = status;
        }),
      resetTours: () =>
        set((state) => {
          state.tourStatus = {};
        }),
    })),
    {
      name: "finals-calculator",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (state) {
            migrateClientStoreIfNeeded(state);
            state.setHasHydrated(true);
          }
          if (error) {
            console.error("Error rehydrating store", error);
          }
        };
      },
    },
  ),
);

export function migrateClientStoreIfNeeded(store: globalDataStore) {
  if (store.schemaVersion < CURRENT_SCHEMA_VERSION) {
    // migrate from schema version 0 to 1
    // change selectedBucket to selectedBucketId
    if (CURRENT_SCHEMA_VERSION === 1) {
      console.log("migrating client store to version 1");
      for (const [id, classObj] of Object.entries(store.classes)) {
        if ("selectedBucket" in (classObj as any)) {
          console.log(
            "Changing selectedBucket to selectedBucketId for class",
            id,
          );
          const updatedClassObj = { ...classObj } as any;
          if (updatedClassObj.selectedBucket !== null) {
            updatedClassObj.selectedBucketId =
              updatedClassObj.selectedBucket.id;
          } else {
            updatedClassObj.selectedBucketId = null;
          }

          delete updatedClassObj.selectedBucket;
          store.editClass(id, updatedClassObj as schoolClass);
        }
      }
    }
  }

  store.updateSchemaVersion(CURRENT_SCHEMA_VERSION);
}
export function migrateServerStoreIfNeeded(store: serverDataStore) {
  const newStore = { ...store };

  if (store.schemaVersion < CURRENT_SCHEMA_VERSION) {
    // migrate from schema version 0 to 1
    // change selectedBucket to selectedBucketId
    if (CURRENT_SCHEMA_VERSION === 1) {
      console.log("migrating server store to version 1");
      for (const [id, classObj] of Object.entries(store.classes)) {
        if (!("selectedBucketId" in (classObj as any))) {
          console.log(
            "Selected bucket id not found in server store, adding it from selectedBucket for class",
            id,
          );
          const updatedClassObj = { ...classObj } as any;
          if (updatedClassObj.selectedBucket !== null) {
            updatedClassObj.selectedBucketId =
              updatedClassObj.selectedBucket.id;
          } else {
            updatedClassObj.selectedBucketId = null;
          }

          delete updatedClassObj.selectedBucket;
          newStore.classes[id] = updatedClassObj as schoolClass;
        }
      }
    }
  }

  newStore.schemaVersion = CURRENT_SCHEMA_VERSION;

  return newStore;
}
