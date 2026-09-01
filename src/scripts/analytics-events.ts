import { track } from "@vercel/analytics";

export const allowedEventNames = ["whatsapp_click", "cta_click"] as const;

type AnalyticsEvent =
  | {
      name: "whatsapp_click";
      properties: { placement: string; label: string };
    }
  | {
      name: "cta_click";
      properties: { placement: string; label: string; target: string };
    };

type EventSender = (
  name: AnalyticsEvent["name"],
  properties: Record<string, string>,
) => void;

export function trackEvent(event: AnalyticsEvent, send: EventSender = track) {
  try {
    send(event.name, event.properties);
  } catch {
    // Analytics nunca pode interferir na ação principal do visitante.
  }
}
