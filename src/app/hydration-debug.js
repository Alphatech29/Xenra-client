// Only run in browser
if (typeof window !== "undefined") {
  const originalError = console.error;

  console.error = (...args) => {
    const first = args[0];

    const isHydration =
      typeof first === "string" &&
      (
        first.includes("Hydration failed") ||
        first.includes("did not match") ||
        first.includes("Text content does not match")
      );

    if (isHydration) {
      debugger; // <-- browser will pause exactly where it happened
    }

    originalError(...args);
  };
}