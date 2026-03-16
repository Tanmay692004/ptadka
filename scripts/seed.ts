/* eslint-disable no-console */
import "dotenv/config";
import mongoose from "mongoose";
import { BlogPost } from "../src/models/BlogPost";

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) throw new Error("MONGODB_URI is required");
const MONGODB_URI: string = mongodbUri;

const seedPosts = [
  {
    slug: "mountain-sunrise",
    title: "Mountain Sunrise",
    titleHindi: "पहाड़ों की भोर",
    excerpt:
      "There's something magical about watching the sun rise over the Himalayan peaks. The golden light on snow-capped mountains feels like poetry.",
    content:
      "There's something magical about watching the sun rise over the Himalayan peaks. The way the golden light touches the snow-capped mountains, painting them in shades of orange and pink... It's a moment that reminds you why we call this place home.",
    date: new Date("2024-12-15"),
    category: "Mountain Life",
    tags: ["sunrise", "himalaya", "nature"],
    published: true,
  },
  {
    slug: "local-cuisine",
    title: "Local Cuisine",
    titleHindi: "पहाड़ी पकवान",
    excerpt:
      "The flavors of pahadi cuisine are as diverse as the landscape itself. Every dish carries stories of tradition and family roots.",
    content:
      "From the comforting warmth of madua ki roti to the tangy zest of bhatt ki churkani, every dish tells a story of tradition and heritage passed down through generations.",
    date: new Date("2024-12-10"),
    category: "Food & Recipes",
    tags: ["pahadi", "food", "recipes"],
    published: true,
  },
  {
    slug: "winter-trails",
    title: "Winter Trails",
    titleHindi: "सर्दियों की पगडंडियां",
    excerpt:
      "Winter transforms the mountains into a wonderland. The trails become harder, but every step rewards you with breathtaking silence.",
    content:
      "Winter transforms our mountains into a wonderland. The trails become challenging yet rewarding, with every step revealing new vistas. The crisp air, the silence broken only by crunching snow – it's meditation in motion.",
    date: new Date("2024-12-05"),
    category: "Trekking & Trails",
    tags: ["winter", "trekking", "snow"],
    published: true,
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);

  for (const post of seedPosts) {
    await BlogPost.updateOne(
      { slug: post.slug },
      { $set: post },
      { upsert: true }
    );
  }

  console.log(`Seeded ${seedPosts.length} posts`);
  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
