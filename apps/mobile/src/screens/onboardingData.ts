export type OnboardingSlideData = {
  key: string;
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  tint: string;
};

export const onboardingSlides: OnboardingSlideData[] = [
  {
    key: "slide-1",
    image:
      "https://images.unsplash.com/photo-1771013151504-10519ebdb8cd?w=750&h=900&fit=crop&auto=format&q=85",
    imageAlt: "Steam rising from a pan on a stove",
    title: "Cook without\ntouching a thing",
    subtitle: "Control recipes with a wave - no more messy screens",
    tint: "rgba(26, 21, 18, 0.28)",
  },
  {
    key: "slide-2",
    image:
      "https://images.unsplash.com/photo-1650452050864-84080836f0ff?w=750&h=900&fit=crop&auto=format&q=85",
    imageAlt: "Fresh produce arranged on a wood counter",
    title: "Never waste an\ningredient again",
    subtitle: "Savora tracks what you have and when it expires",
    tint: "rgba(26, 21, 18, 0.22)",
  },
  {
    key: "slide-3",
    image:
      "https://images.unsplash.com/photo-1663530761401-15eefb544889?w=750&h=900&fit=crop&auto=format&q=85",
    imageAlt: "Sauce being poured over an elegantly plated dish",
    title: "Recipes made\nfor you",
    subtitle: "Personalized suggestions from what's already in your kitchen",
    tint: "rgba(26, 21, 18, 0.32)",
  },
];
