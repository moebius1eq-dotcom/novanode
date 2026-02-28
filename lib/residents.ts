export interface ResidentTip {
  name: string;
  handle: string;
  text: string;
}

export const VERIFIED_RESIDENT_TIPS: Record<string, ResidentTip> = {
  "northside-social": {
    name: "Alex R.",
    handle: "@nova-remote",
    text: "Downstairs is usually the move for stable work blocks on weekends.",
  },
  "caboose-commons": {
    name: "Priya M.",
    handle: "@arlnomad",
    text: "Floor 3 stays much quieter for deep work than the ground level.",
  },
  "3den-tysons": {
    name: "Marcus L.",
    handle: "@tysonsbuilder",
    text: "Best call quality spot in Tysons if you need back-to-back meetings.",
  },
};
