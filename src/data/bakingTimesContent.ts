export interface BakingTimeRow {
  size: string;
  temp: string;
  time: string;
  notes: string;
}

export interface BakingTimesContent {
  title: string;
  metaDescription: string;
  intro: string;
  whenToAdjust: string[];
  rows: BakingTimeRow[];
  donenessTips: string[];
  faq: { question: string; answer: string }[];
  relatedCategories?: string[];
}

export const bakingTimesContent: Record<string, BakingTimesContent> = {
  standard: {
    title: 'Standard cupcakes baking time',
    metaDescription:
      'Standard cupcake baking times at 175°C (350°F): 18–20 minutes for most batters, when to lower temp for keto or almond flour, and how to test doneness.',
    intro:
      'Standard cupcakes baked in regular muffin tins (about 2–3 inches wide) set fastest at the center when the oven is fully preheated and liners are filled two-thirds full. Most classic butter or oil batters finish in 18–20 minutes at 175°C (350°F).',
    whenToAdjust: [
      'Lower to 165°C (325°F) for dense keto, almond-flour, or high-fat batters — add 2–4 minutes and watch tops.',
      'Raise temp by 15°C only if tops are pale and centers are set; otherwise domes may crack.',
      'Rotate the pan once, in the last third of bake time, if your oven has hot spots.',
      'Dark pans brown faster; check 2 minutes early if using nonstick or charcoal-colored tins.',
    ],
    rows: [
      {
        size: 'Standard (regular muffin tin)',
        temp: '175°C / 350°F',
        time: '18–20 min',
        notes: 'Most vanilla, chocolate, and yellow cake batters',
      },
      {
        size: 'Standard — rich or keto batter',
        temp: '165°C / 325°F',
        time: '20–22 min',
        notes: 'Almond flour, cream cheese batter, high cocoa',
      },
      {
        size: 'Standard — filled centers',
        temp: '175°C / 350°F',
        time: '20–24 min',
        notes: 'Jam, curd, or truffle-filled cupcakes; test center with skewer',
      },
    ],
    donenessTips: [
      'Skewer inserted in the center should come out clean or with a few moist crumbs — not wet batter.',
      'Tops spring back when lightly pressed; internal temperature near 98–99°C (208–210°F) in the center.',
      'Cool in the pan 5 minutes, then transfer to a rack to prevent soggy bottoms.',
    ],
    faq: [
      {
        question: 'Why are my standard cupcakes still wet at 18 minutes?',
        answer:
          'Oven calibration, overfilled liners, or cold batter delay setting. Bake in 2-minute increments until the skewer test passes.',
      },
      {
        question: 'Should I use convection for cupcakes?',
        answer:
          'If using convection, reduce temperature by 15°C (25°F) and check 3–5 minutes early. Not all ovens benefit for small batches.',
      },
    ],
    relatedCategories: ['classic'],
  },
  mini: {
    title: 'Mini cupcakes baking time',
    metaDescription:
      'Mini cupcake baking times: 10–12 minutes at 175°C (350°F), filling tips, and how to avoid overbaking small batters.',
    intro:
      'Mini cupcakes have a high surface-area-to-volume ratio, so they bake quickly and dry out if left even one minute too long. Fill mini liners about half full for even domes.',
    whenToAdjust: [
      'Start checking at 9 minutes; mini keto batters may need the full 12.',
      'Bake one test cupcake first when trying a new recipe in mini format.',
      'Use two pans on one rack rather than stacking racks for even heat.',
    ],
    rows: [
      {
        size: 'Mini (1–1.5 inch liners)',
        temp: '175°C / 350°F',
        time: '10–12 min',
        notes: 'Check at 9 min; tops should spring back',
      },
      {
        size: 'Mini — chocolate or keto',
        temp: '165°C / 325°F',
        time: '11–13 min',
        notes: 'Slightly longer at lower temp prevents dry edges',
      },
    ],
    donenessTips: [
      'Mini cupcakes can look done while centers are still wet — always skewer-test the largest one.',
      'Remove immediately when done; mini liners cool fast but overbake in the hot pan.',
    ],
    faq: [
      {
        question: 'Can I use the same batter as standard cupcakes?',
        answer:
          'Yes, but reduce bake time by roughly 40–50% and expect more domes if filled too high.',
      },
    ],
    relatedCategories: ['classic', 'gourmet'],
  },
  jumbo: {
    title: 'Jumbo cupcakes baking time',
    metaDescription:
      'Jumbo cupcake baking times: 22–26 minutes at 175°C (350°F), filling guidelines, and preventing sunken centers in large liners.',
    intro:
      'Jumbo cupcakes (Texas muffin size or jumbo liners) need longer for the center to set. Fill no more than two-thirds full to reduce overflow and sunken middles.',
    whenToAdjust: [
      'Add 4–6 minutes if batter includes mix-ins, fruit purée, or cream cheese.',
      'If tops brown before centers set, tent loosely with foil for the last 5–8 minutes.',
      'Avoid opening the oven in the first two-thirds of bake time — jumbo batters collapse easily.',
    ],
    rows: [
      {
        size: 'Jumbo (Texas muffin / jumbo liner)',
        temp: '175°C / 350°F',
        time: '22–26 min',
        notes: 'Skewer must come clean from geometric center',
      },
      {
        size: 'Jumbo — filled or cheesecake-stuffed',
        temp: '165°C / 325°F',
        time: '26–30 min',
        notes: 'Lower temp helps center set without burning tops',
      },
    ],
    donenessTips: [
      'Jumbo cupcakes are prone to sinking if underbaked — prioritize center set over pale tops.',
      'Cool completely before heavy frosting; warm centers will melt buttercream.',
    ],
    faq: [
      {
        question: 'Why did my jumbo cupcakes sink in the middle?',
        answer:
          'Underbaking, overfilling, or opening the oven too early. See our sunken cupcake troubleshooting guide for a full cause-and-fix table.',
      },
    ],
    relatedCategories: ['classic', 'gourmet'],
  },
};
