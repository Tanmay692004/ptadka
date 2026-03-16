import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  titleHindi?: string;
  excerpt: string;
  content: string;
  date: Date;
  category: string;
  tags: string[];
  thumbnail?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    titleHindi: { type: String },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    thumbnail: { type: String },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ?? mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
