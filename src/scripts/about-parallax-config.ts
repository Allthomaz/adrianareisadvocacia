export const LAYER_ORDER = ["background", "subject", "foreground"] as const;
export type LayerName = (typeof LAYER_ORDER)[number];
