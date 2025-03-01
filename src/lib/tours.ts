import { Tour } from "nextstepjs";

export const welcomeTour: Tour[] = [
  {
    tour: "welcome-tour",
    steps: [
      {
        icon: "👋",
        title: "Welcome!",
        content: "Let's walk though getting you started",
        selector: "#add-class-dialog",
        side: "bottom",
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
        selector: "#add-class-tabs",
        side: "bottom",
        showControls: true,
        pointerPadding: 8,
        pointerRadius: 8,
        // showSkip: true,
      },
    ],
  },
];
