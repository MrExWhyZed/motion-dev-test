export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  accent: string;
  badge: string | null;
  line: string;
  summary: string;
  metrics: { value: string; label: string }[];
  features: string[];
  deliverables: string[];
  bestFor: string;
  turnaround: string;
  ownership: string;
  revisions: string;
  traditionalEquivalent: string;
};

export type ComparisonRow = {
  label: string;
  traditional: string;
  essentials: string;
  viral: string;
};

export type PricingFaq = {
  question: string;
  answer: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'essentials',
    name: 'The Essentials',
    price: 'INR 34,999',
    accent: '#C9A96E',
    badge: null,
    line: 'Fast premium launch assets.',
    summary:
      'A polished entry point for beauty founders who need a hero-ready digital twin, elegant stills, and a clean motion loop without organizing a full shoot.',
    metrics: [
      { value: '20', label: 'Stills' },
      { value: '1', label: 'Loop' },
      { value: '5', label: 'Days' },
      { value: '1', label: 'Set Build' },
    ],
    features: [
      'Digital twin modeling and surfacing',
      'One premium virtual set direction',
      'Commerce-ready exports for launch week',
      'Usage handoff for your internal team',
    ],
    deliverables: [
      'High-resolution product still pack',
      'One short motion loop for paid or organic social',
      'Launch crops sized for web and marketplace listings',
      'Lighting and material setup saved for future rollouts',
    ],
    bestFor: 'New launches, single-SKU drops, first paid campaign tests.',
    turnaround: 'Around 5 business days once product references are approved.',
    ownership: 'You keep the approved digital twin and the final exported assets.',
    revisions: 'Two focused revision rounds after first delivery.',
    traditionalEquivalent: 'Roughly replaces a small studio still-life shoot and motion pickup day.',
  },
  {
    id: 'viral',
    name: 'The Viral Impact',
    price: 'INR 74,999',
    accent: '#4A9EFF',
    badge: 'Signature',
    line: 'Hero motion plus launch depth.',
    summary:
      'A heavier launch package built for brands that want their hero film, campaign stills, and interactive-ready assets to come from one owned production system.',
    metrics: [
      { value: '40', label: 'Stills' },
      { value: '1', label: 'Hero Film' },
      { value: '1', label: 'AR Asset' },
      { value: '7', label: 'Days' },
    ],
    features: [
      'Advanced digital twin with hero-grade lighting',
      'Cinematic launch film with richer camera choreography',
      'Expanded still library for paid, retail, and social',
      'Interactive or AR-ready asset handoff',
    ],
    deliverables: [
      'Hero motion piece for launch campaigns',
      'Broader still pack for ads, PDP, and community content',
      'AR-ready or interactive asset export',
      'Saved production system for seasonal iterations',
    ],
    bestFor: 'Flagship launches, campaign refreshes, and multi-channel beauty rollouts.',
    turnaround: 'Usually 7 business days depending on film complexity.',
    ownership: 'You keep the digital twin system and all approved final outputs.',
    revisions: 'Two structured revision rounds with creative direction checkpoints.',
    traditionalEquivalent: 'Roughly replaces a campaign shoot, motion unit, and extra retouching cycle.',
  },
];

export const pricingComparisonRows: ComparisonRow[] = [
  {
    label: 'Production timeline',
    traditional: '4 to 6 weeks',
    essentials: 'About 5 days',
    viral: 'About 7 days',
  },
  {
    label: 'Asset volume',
    traditional: '10 to 20 selects',
    essentials: '20 launch assets',
    viral: '40 plus campaign assets',
  },
  {
    label: 'Motion output',
    traditional: 'Separate crew or extra day',
    essentials: 'One premium loop',
    viral: 'Hero film included',
  },
  {
    label: 'Set flexibility',
    traditional: 'One physical environment',
    essentials: 'One virtual set',
    viral: 'Expanded digital worlds',
  },
  {
    label: 'Revision speed',
    traditional: 'Reshoots and retouch delays',
    essentials: 'Update inside the twin',
    viral: 'Faster campaign pivots',
  },
  {
    label: 'Ownership after launch',
    traditional: 'Mostly final edited files',
    essentials: 'Twin plus outputs',
    viral: 'System plus outputs',
  },
];

export const pricingFaqs: PricingFaq[] = [
  {
    question: 'What do you need from us before production starts?',
    answer:
      'We usually need clear product photos, dimensions, label artwork, finish references, and a short brand direction note. If you already have packaging files or CAD, the setup gets even faster.',
  },
  {
    question: 'Can we request edits after the first delivery?',
    answer:
      'Yes. Each package includes two revision rounds. We structure those revisions around shot selection, lighting, material feel, and campaign polish so feedback stays fast and focused.',
  },
  {
    question: 'Do we own the final digital twin and assets?',
    answer:
      'Yes. Once the work is approved and delivered, you keep the approved exported assets and the production-ready digital twin setup tied to your package.',
  },
  {
    question: 'How is this different from a traditional product shoot?',
    answer:
      'Traditional shoots lock you into one set, one day, and one output window. Our approach builds a reusable digital production system, so angles, seasons, formats, and revisions happen without reshooting the product.',
  },
  {
    question: 'Can you support larger custom retainers or seasonal rollouts?',
    answer:
      'Yes. The two public packages cover the most common launch scopes, but we also build custom retainers for ongoing campaigns, multi-SKU systems, retail refreshes, and monthly content engines.',
  },
];
