import { Tour } from "nextstepjs";

export const tours: Tour[] = [
  {
    tour: "welcome-tour",
    steps: [
      {
        icon: "👋",
        title: "Welcome!",
        content: "Let's walk though getting you started",
        selector: "#add-class-dialog",
        side: "top",
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
          "Click + to use it as a template or ? to inspect the class details",
        selector: "#search-results-container",
        showControls: true,
        side: "right",
        pointerPadding: 12,
        pointerRadius: 12,
        // showSkip: true,
      },
    ],
  },
];
