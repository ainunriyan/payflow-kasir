import React from "react";
import {
  Coffee,
  Utensils,
  Cookie,
  IceCream,
  Plus,
  Package,
  Droplets,
  Zap,
} from "lucide-react";

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategorySelect,
  productCounts,
}) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Makanan Berat":
        return <Utensils size={20} />;
      case "Coffee":
        return <Coffee size={20} />;
      case "Non Coffee":
        return <Zap size={20} />;
      case "Ice Cream":
        return <IceCream size={20} />;
      case "Refreshment":
        return <Droplets size={20} />;
      case "Makanan Ringan":
        return <Cookie size={20} />;
      case "Dessert":
        return <IceCream size={20} />;
      case "Topping":
        return <Plus size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Makanan Berat":
        return "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200";
      case "Coffee":
        return "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200";
      case "Non Coffee":
        return "bg-teal-100 text-teal-700 border-teal-300 hover:bg-teal-200";
      case "Ice Cream":
        return "bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-200";
      case "Refreshment":
        return "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200";
      case "Makanan Ringan":
        return "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200";
      case "Dessert":
        return "bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200";
      case "Topping":
        return "bg-green-100 text-green-700 border-green-300 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="font-semibold text-lg mb-3">Filter Kategori</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategorySelect("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-purple-500 text-white border-purple-500"
              : "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200"
          }`}>
          <Package size={20} />
          Semua ({productCounts.total || 0})
        </button>

        <button
          onClick={() => onCategorySelect("Coffee")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
            selectedCategory === "Coffee"
              ? "bg-blue-500 text-white border-blue-500"
              : getCategoryColor("Coffee")
          }`}>
          <Coffee size={20} />
          Coffee ({productCounts["Coffee"] || 0})
        </button>

        <button
          onClick={() => onCategorySelect("Non Coffee")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
            selectedCategory === "Non Coffee"
              ? "bg-blue-500 text-white border-blue-500"
              : getCategoryColor("Non Coffee")
          }`}>
          <Zap size={20} />
          Non Coffee ({productCounts["Non Coffee"] || 0})
        </button>

        {categories
          .filter((cat) => cat !== "Coffee" && cat !== "Non Coffee")
          .map((category) => {
            const count = productCounts[category] || 0;
            if (count === 0) return null;

            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white border-blue-500"
                    : getCategoryColor(category)
                }`}>
                {getCategoryIcon(category)}
                {category} ({count})
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryFilter;
