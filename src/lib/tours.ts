import { Tour } from "nextstepjs";

export const tours: Tour[] = [
  {
    tour: "welcome-tour",
    steps: [
      {
        icon: "👋",
        title: "Welcome!",
        content:
          "mygrads.app is *the* feature complete grade calculator for students. We'll walk you through creating a class schema, editing, and publishing it!",
        selector: "#add-class-dialog",
        side: "left",
        showControls: true,
        pointerPadding: 0,
        pointerRadius: 0,
        // showSkip: true,
      },
      {
        icon: "🔍",
        title: "Class Options",
        content:
          "Start by creating your own class or searching existing templates",
        selector: "#add-class-dialog",
        side: "left",
        // showControls: true,
        pointerPadding: 0,
        pointerRadius: 0,
        // showSkip: true,
      },
    ],
  },
  {
    tour: "create-class-tour",
    steps: [
      {
        icon: "ℹ",
        title: "Set Class Info",
        content: "Set the name and number of your class",
        selector: "#class-info-container",
        showControls: true,
        side: "left",
        pointerPadding: 12,
        pointerRadius: 12,
        // showSkip: true,
      },
      {
        icon: "ℹ️",
        title: "Set Weights",
        content: "Set the weights for each bucket of assignments",
        selector: "#weights-container",
        showControls: true,
        side: "right",
        pointerPadding: 12,
        pointerRadius: 12,
        // showSkip: true,
      },
      {
        icon: "✅",
        title: "Add Class",
        content: "Add your class to your account!",
        selector: "#add-class-button-form-button",
        showControls: true,
        side: "bottom",
        pointerPadding: 12,
        pointerRadius: 12,
        // showSkip: true,
      },
    ],
  },
  {
    tour: "search-class-tour",
    steps: [
      {
        icon: "🔍",
        title: "Specify Search",
        content: "Search by course name, number, and school!",
        selector: "#search-filters-container",
        // showControls: true,
        side: "left",
        pointerPadding: 12,
        pointerRadius: 12,
        // showSkip: true,
      },
      {
        icon: "🔍",
        title: "Search Results",
        content:
          "Click + to copy the class template or ? to inspect the template details",
        selector: "#search-results-container",
        showControls: true,
        side: "right",
        pointerPadding: 12,
        pointerRadius: 12,
        // showSkip: true,
      },
    ],
  },
  {
    tour: "sidebar-tour",
    steps: [
      {
        icon: "",
        title: "Sidebar",
        content: "Your sidebar shows all your classes and additional options",
        selector: "#sidebar-for-tour",
        showControls: true,
        side: "right",
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: "",
        title: "Sign In",
        content:
          "By default all your data is local on your device. You can log in to sync your data across devices and publish your own schemas",
        selector: "#sign-in-button",
        showControls: true,
        side: "top-left",
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: "",
        title: "Class Options",
        content:
          "Select a class by clicking on it. This is also where you edit, delete, and publish classes.",
        selector: "#first-sidebar-class",
        showControls: true,
        side: "right",
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "fill-in-class-tour",
    steps: [
      {
        icon: "",
        title: "Fill in Assignments",
        content: "Give each assignment in a bucket a name and score",
        selector: "#first-bucket",
        showControls: true,
        side: "top",
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: "",
        title: "Select target Assignment",
        content:
          "Choose the assignment you want to know your needed score for. For example, if your class has a final, create a weighted assignment for it and then select it.",
        selector: "#select-target",
        showControls: true,
        side: "top",
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "publish-tour",
    steps: [
      {
        icon: "",
        title: "Publish your Class",
        content:
          "Publishing lets a class appear in search results. You can choose whether to publish your assignment names (not scores don't worry!)",
        selector: "#publish-target",
        showControls: true,
        side: "left",
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
];
