export type QuickStat = {
  label: string;
  value: string;
};

export type Ingredient = {
  id: string;
  amount: number;
  unit: string;
  name: string;
  note?: string;
  inPantry: boolean;
};

export type RecipeStep = {
  id: string;
  instruction: string;
  timerMinutes?: number;
  linkedRecipe?: string;
};

export type NutritionItem = {
  label: string;
  grams: number;
  color: string;
};

export type CookLogEntry = {
  id: string;
  date: string;
  note: string;
  rating: number;
};

export type Recipe = {
  id: string;
  title: string;
  source: string;
  heroImage: string;
  description: string;
  heroTag: string;
  quickStats: QuickStat[];
  servings: number;
  pantryOwned: number;
  pantryTotal: number;
  missingIngredients: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutrition: NutritionItem[];
  cookHistory: string;
  communityRating: string;
  logs: CookLogEntry[];
};

export const demoRecipe: Recipe = {
  id: 'savora-creamy-tuscan-chicken',
  title: 'Creamy Tuscan Chicken with Charred Lemon',
  source: 'Imported from Half Baked Harvest',
  heroImage:
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80',
  description:
    'A weeknight skillet dinner with browned chicken, garlic spinach cream sauce, and a bright lemon finish.',
  heroTag: 'Savora Pick',
  quickStats: [
    { label: 'Prep', value: '15m' },
    { label: 'Cook', value: '30m' },
    { label: 'Serves', value: '4' },
    { label: 'Difficulty', value: 'Medium' },
  ],
  servings: 4,
  pantryOwned: 6,
  pantryTotal: 8,
  missingIngredients: ['heavy cream', 'parmesan'],
  ingredients: [
    {
      id: 'chicken',
      amount: 4,
      unit: 'pcs',
      name: 'boneless chicken thighs',
      note: 'patted dry',
      inPantry: true,
    },
    {
      id: 'salt',
      amount: 1,
      unit: 'tsp',
      name: 'kosher salt',
      inPantry: true,
    },
    {
      id: 'pepper',
      amount: 0.5,
      unit: 'tsp',
      name: 'black pepper',
      inPantry: true,
    },
    {
      id: 'garlic',
      amount: 4,
      unit: 'cloves',
      name: 'garlic',
      note: 'finely sliced',
      inPantry: true,
    },
    {
      id: 'spinach',
      amount: 3,
      unit: 'cups',
      name: 'baby spinach',
      inPantry: true,
    },
    {
      id: 'cream',
      amount: 1,
      unit: 'cup',
      name: 'heavy cream',
      inPantry: false,
    },
    {
      id: 'parmesan',
      amount: 0.75,
      unit: 'cup',
      name: 'parmesan',
      note: 'freshly grated',
      inPantry: false,
    },
    {
      id: 'lemon',
      amount: 1,
      unit: '',
      name: 'lemon',
      note: 'halved',
      inPantry: true,
    },
  ],
  steps: [
    {
      id: 'step-1',
      instruction:
        'Season the chicken with salt and black pepper, then sear in a hot skillet until deeply golden on both sides.',
      timerMinutes: 8,
    },
    {
      id: 'step-2',
      instruction:
        'Reduce the heat and add the garlic. Stir for 1 minute until fragrant, then add the heavy cream and parmesan.',
      timerMinutes: 1,
    },
    {
      id: 'step-3',
      instruction:
        'Fold in the spinach and simmer gently until the sauce thickens enough to coat the back of a spoon.',
      timerMinutes: 12,
    },
    {
      id: 'step-4',
      instruction:
        'Finish with charred lemon juice and spoon over Mushroom Duxelles toast if serving for brunch.',
      linkedRecipe: 'Mushroom Duxelles',
    },
  ],
  nutrition: [
    { label: 'Protein', grams: 38, color: '#3DBE6C' },
    { label: 'Carbs', grams: 14, color: '#E8854A' },
    { label: 'Fat', grams: 28, color: '#F2C94C' },
  ],
  cookHistory: 'You cooked this 3 times',
  communityRating: '4.8 from 126 home cooks',
  logs: [
    {
      id: 'log-1',
      date: 'May 18',
      rating: 5,
      note: 'Added chili flakes at the end and served with saffron rice.',
    },
    {
      id: 'log-2',
      date: 'May 02',
      rating: 4,
      note: 'Used Greek yogurt as a cream swap. It worked, but the sauce was tangier.',
    },
  ],
};
export const initialRecipes: Recipe[] = [
  demoRecipe,
  {
    ...demoRecipe,
    id: 'savora-harissa-chickpea-skillet',
    title: 'Harissa Chickpea Skillet with Lemon Yogurt',
    heroImage:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    heroTag: 'Savora Pick',
    description:
      'A vivid one-pan meal with smoky harissa, tender chickpeas, and a cooling lemon yogurt finish.',
    source: 'Savora Kitchen',
    missingIngredients: ['Greek yogurt', 'lemon'],
    quickStats: [
      { label: 'Prep', value: '10m' },
      { label: 'Cook', value: '22m' },
      { label: 'Serves', value: '4' },
      { label: 'Difficulty', value: 'Easy' },
    ],
  },
  {
    ...demoRecipe,
    id: 'savora-lemon-herb-couscous-bowl',
    title: 'Lemon Herb Couscous Bowl with Roasted Veggies',
    heroImage:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    heroTag: 'Zero Waste',
    description:
      'A bright plant-forward bowl built around fluffy couscous, roasted seasonal veg, and herbed tahini.',
    source: 'Savora Garden',
    missingIngredients: ['tahini', 'parsley'],
    quickStats: [
      { label: 'Prep', value: '12m' },
      { label: 'Cook', value: '20m' },
      { label: 'Serves', value: '4' },
      { label: 'Difficulty', value: 'Easy' },
    ],
  },
  {
    ...demoRecipe,
    id: 'savora-garlic-butter-salmon',
    title: 'Garlic Butter Salmon with Herbs',
    heroImage:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    heroTag: 'Savora Pick',
    description:
      'A rich garlic butter salmon fillet served with crisp lemon capers and silky greens.',
    source: 'Savora Sea',
    missingIngredients: ['capers', 'lemon'],
    quickStats: [
      { label: 'Prep', value: '10m' },
      { label: 'Cook', value: '18m' },
      { label: 'Serves', value: '2' },
      { label: 'Difficulty', value: 'Easy' },
    ],
  },
];
