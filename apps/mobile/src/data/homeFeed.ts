export type ReadyRecipe = {
  id: string;
  recipeId: string;
  title: string;
  image: string;
  time: string;
  pantryLabel: string;
  pantryMatch: number;
};

export type FeedRecipe = {
  id: string;
  recipeId: string;
  title: string;
  image: string;
  cuisine: string;
  time: string;
  difficulty: number;
  pantryMatch: number;
  aiPick?: boolean;
};

export type Collection = {
  id: string;
  title: string;
  image: string;
};

export type RecentRecipe = {
  id: string;
  recipeId: string;
  title: string;
  image: string;
  source: string;
};

export const readyToCookRecipes: ReadyRecipe[] = [
  {
    id: 'ready-1',
    recipeId: 'savora-creamy-tuscan-chicken',
    title: 'Creamy Tuscan Chicken',
    image:
      'https://images.unsplash.com/photo-1604908176997-4318c0b5c3f1?auto=format&fit=crop&w=1200&q=80',
    time: '25 min',
    pantryLabel: 'All ingredients in pantry',
    pantryMatch: 1,
  },
  {
    id: 'ready-2',
    recipeId: 'savora-harissa-chickpea-skillet',
    title: 'Harissa Chickpea Skillet',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    time: '20 min',
    pantryLabel: '7 of 8 ingredients ready',
    pantryMatch: 0.88,
  },
  {
    id: 'ready-3',
    recipeId: 'savora-lemon-herb-couscous-bowl',
    title: 'Lemon Herb Couscous Bowl',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    time: '18 min',
    pantryLabel: '5 of 6 ingredients ready',
    pantryMatch: 0.84,
  },
  {
    id: 'ready-4',
    recipeId: 'savora-garlic-butter-salmon',
    title: 'Garlic Butter Salmon',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    time: '22 min',
    pantryLabel: '1 item missing',
    pantryMatch: 0.8,
  },
];

export const forYouRecipes: FeedRecipe[] = [
  {
    id: 'feed-1',
    recipeId: 'savora-creamy-tuscan-chicken',
    title: 'Creamy Tuscan Chicken with Charred Lemon',
    image:
      'https://images.unsplash.com/photo-1604908176997-4318c0b5c3f1?auto=format&fit=crop&w=1200&q=80',
    cuisine: 'Italian-inspired',
    time: '45 min',
    difficulty: 2,
    pantryMatch: 92,
    aiPick: true,
  },
  {
    id: 'feed-2',
    recipeId: 'savora-harissa-chickpea-skillet',
    title: 'Harissa Chickpea Skillet',
    image:
      'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80',
    cuisine: 'North African',
    time: '30 min',
    difficulty: 2,
    pantryMatch: 86,
  },
  {
    id: 'feed-3',
    recipeId: 'savora-lemon-herb-couscous-bowl',
    title: 'Lemon Herb Couscous Bowl',
    image:
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80',
    cuisine: 'Mediterranean',
    time: '35 min',
    difficulty: 1,
    pantryMatch: 74,
    aiPick: true,
  },
];

export const collections: Collection[] = [
  {
    id: 'collection-1',
    title: '30-min meals',
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'collection-2',
    title: 'High Protein',
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'collection-3',
    title: 'Algerian Classics',
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'collection-4',
    title: 'Comfort Bowls',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  },
];

export const recentRecipes: RecentRecipe[] = [
  {
    id: 'recent-1',
    recipeId: 'savora-creamy-tuscan-chicken',
    title: 'Creamy Tuscan Chicken with Charred Lemon',
    image:
      'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=1200&q=80',
    source: 'Budget Bytes',
  },
  {
    id: 'recent-2',
    recipeId: 'savora-harissa-chickpea-skillet',
    title: 'Harissa Chickpea Skillet',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    source: 'NYT Cooking',
  },
  {
    id: 'recent-3',
    recipeId: 'savora-lemon-herb-couscous-bowl',
    title: 'Lemon Herb Couscous Bowl',
    image:
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80',
    source: 'Ottolenghi',
  },
  {
    id: 'recent-4',
    recipeId: 'savora-garlic-butter-salmon',
    title: 'Garlic Butter Salmon',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    source: 'Local Import',
  },
];
