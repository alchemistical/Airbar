// Analytics event dispatcher for tracking user interactions

export type AnalyticsEvent = {
  hp_intent_change: { intent: string };
  hp_hero_send_click: Record<string, never>;
  hp_hero_travel_click: Record<string, never>;
  hp_hero_estimator_submit: { from?: string; to?: string; weight?: number };
  hp_trust_badge_click: { badge: string };
  hp_persona_cta_click: { intent: string };
  hp_hiw_cta_click: { intent: string };
  hp_estimator_full_submit: { from: string; to: string; weight: number; window: string };
  hp_route_card_click: { route: string; intent: string };
  hp_testimonial_cycle: Record<string, never>;
  hp_biz_lead_submit: { email: string };
  hp_end_cta_click: { intent: string };
};

// Track function with type safety
export function track<T extends keyof AnalyticsEvent>(
  eventName: T,
  payload?: AnalyticsEvent[T]
): void {
  try {
    // Push to dataLayer for Google Analytics
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...payload,
      });
    }
    
    // Console log in development
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${eventName}`, payload);
    }
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

// Declare dataLayer on window
declare global {
  interface Window {
    dataLayer?: any[];
  }
}