import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISearchQuery extends Document {
  canonicalName: string;
  count: number;
  aliases: string[];
  category: string;
  lastSearchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SearchQuerySchema = new Schema<ISearchQuery>(
  {
    canonicalName: { type: String, required: true, unique: true, index: true },
    count: { type: Number, default: 1 },
    aliases: { type: [String], default: [] },
    category: { type: String, default: "Other" },
    lastSearchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Text index for fuzzy canonical name lookup
SearchQuerySchema.index({ canonicalName: "text", aliases: "text" });

export const SearchQuery: Model<ISearchQuery> =
  mongoose.models.SearchQuery ??
  mongoose.model<ISearchQuery>("SearchQuery", SearchQuerySchema);
