"use client";

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export function GalleryCategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === category
              ? "bg-foreground text-background shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

