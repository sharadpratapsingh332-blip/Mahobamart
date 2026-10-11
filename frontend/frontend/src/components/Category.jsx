
import {
  UtensilsCrossed,
  ShoppingBasket,
  Pill,
  Apple,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    _id: "6abe959269186da1bfcd069e",
    title: "Food",
    subtitle: "Restaurants & Fast Food",
    icon: UtensilsCrossed,
    bg: "bg-orange-50",
  },
  {
    _id: "6abe95e069186da1bfcd069f",
    title: "Grocery",
    subtitle: "Daily Essentials",
    icon: ShoppingBasket,
    bg: "bg-green-50",
  },
  {
    _id: "6ac1233a6991f682676a6408",
    title: "Medicine",
    subtitle: "Health & Wellness",
    icon: Pill,
    bg: "bg-blue-50",
  },
  {
    _id: "6ac240d225a2d015a873494f",
    title: "Fruits & Vegetables",
    subtitle: "Fresh & Organic",
    icon: Apple,
    bg: "bg-purple-50",
  },
  {
    _id: "6ac2413225a2d015a8734950",
    title: "Pickup & Drop",
    subtitle: "Documents & Parcels",
    icon: Package,
    bg: "bg-yellow-50",
  },
];

const Categories = () => {
  return (
    <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
        {categories.map((item, index) => {
          const Icon = item.icon;
          const isPickup = index === 4;

          return (
            <Link
              key={item._id}
              to={`/category/${item._id}`}
              className={`
                ${item.bg}
                ${isPickup ? "col-span-2 lg:col-span-1" : ""}
                flex min-w-0 flex-col items-center justify-center
                rounded-xl border border-gray-100
                p-3 text-center shadow-sm
                transition duration-200
                hover:-translate-y-1 hover:shadow-md
                sm:rounded-2xl sm:p-5
                lg:items-start lg:text-left
              `}
            >
              <Icon
                size={32}
                strokeWidth={1.8}
                className="shrink-0 text-green-700 sm:h-10 sm:w-10"
              />

              <h3 className="mt-2 text-sm font-bold leading-tight text-gray-900 sm:mt-3 sm:text-lg">
                {item.title}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
                {item.subtitle}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;