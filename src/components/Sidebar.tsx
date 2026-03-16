import { Paperclip } from "@/components/ui/Paperclip";
import Link from "next/link";

const categories = [
  { icon: "🏔️", label: "Mountain Life", href: "/blog?category=mountain-life" },
  { icon: "🍲", label: "Food & Recipes", href: "/blog?category=food-recipes" },
  { icon: "🥾", label: "Trekking & Trails", href: "/blog?category=trekking" },
  { icon: "📸", label: "Photography", href: "/blog?category=photography" },
  { icon: "🎭", label: "Culture & Traditions", href: "/blog?category=culture" },
];

const recentPostTitles = [
  "Monsoon in the Valley",
  "Festival Celebrations",
  "Hidden Waterfalls",
  "Village Stories",
  "Star Gazing Nights",
];

export function Sidebar() {
  return (
    <aside className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories */}
        <div className="group relative notebook-page p-8 pt-10 shadow-lg"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.07) 95%),linear-gradient(transparent 95%, rgba(0,0,0,0.07) 95%)`,
            backgroundSize: "20px 20px",
          }}
        >
          <Paperclip />
          <h3 className="font-playfair text-xl font-bold mb-5 pb-3 border-b border-current opacity-80">
            Categories
          </h3>
          <ul className="space-y-0">
            {categories.map((cat) => (
              <li
                key={cat.label}
                className="py-3 border-b border-current/20 opacity-70 hover:opacity-100 hover:pl-3 transition-all duration-200"
              >
                <Link href={cat.href} className="flex items-center gap-3 text-sm font-medium">
                  <span>{cat.icon}</span>
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Posts */}
        <div className="group relative notebook-page p-8 pt-10 shadow-lg"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.07) 95%),linear-gradient(transparent 95%, rgba(0,0,0,0.07) 95%)`,
            backgroundSize: "20px 20px",
          }}
        >
          <Paperclip />
          <h3 className="font-playfair text-xl font-bold mb-5 pb-3 border-b border-current opacity-80">
            Recent Posts
          </h3>
          <ul className="space-y-0">
            {recentPostTitles.map((title) => (
              <li
                key={title}
                className="py-3 border-b border-current/20 opacity-70 hover:opacity-100 hover:pl-3 transition-all duration-200"
              >
                <Link href="#blog" className="text-sm font-medium">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
