/**
 * Helpers for the Claudde Bot chat widget.
 *
 * The widget mounts itself as a custom element with an open shadow root.
 * We locate that host, then click the launcher button inside its shadow root.
 */

const findWidgetHost = (): HTMLElement | null => {
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>("*"));
  for (const el of elements) {
    const root = el.shadowRoot;
    if (!root) continue;
    // Prefer hosts that actually contain a clickable launcher
    if (root.querySelector("button")) return el;
  }
  return null;
};

const clickLauncher = (host: HTMLElement): boolean => {
  const root = host.shadowRoot;
  if (!root) return false;

  const launcher =
    root.querySelector<HTMLElement>(
      '[class*="launcher"], [class*="bubble"], [class*="toggle"], [aria-label*="chat" i]'
    ) ?? root.querySelector<HTMLElement>("button");

  if (!launcher) return false;
  launcher.click();
  return true;
};

/**
 * Opens the Claudde chat panel. Retries for a few seconds in case the widget
 * script has not finished mounting yet.
 */
export const openClauddeWidget = (timeoutMs = 5000): void => {
  const start = Date.now();

  const attempt = () => {
    const host = findWidgetHost();
    if (host && clickLauncher(host)) return;

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
