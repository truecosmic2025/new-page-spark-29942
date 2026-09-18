interface ClauddeWidget {
  open?: () => void;
}

declare global {
  interface Window {
    Claudde?: ClauddeWidget;
  }
}

/**
 * Opens the hosted Claudde widget. The retry covers a CTA click that occurs
 * before the deferred widget script has initialized its public API.
 */
export const openClauddeWidget = (timeoutMs = 5000): void => {
  const start = Date.now();

  const attempt = () => {
    if (window.Claudde?.open) {
      window.Claudde?.open();
      return;
    }

    if (Date.now() - start < timeoutMs) {
      window.setTimeout(attempt, 250);
    }
  };

  attempt();
};

/** Scrolls to the booking section and opens the chat widget. */
export const goToBookingAndOpenChat = (): void => {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  openClauddeWidget();
};
