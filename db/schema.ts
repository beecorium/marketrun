import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const surveyResponses = sqliteTable("survey_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  rating: integer("rating").notNull(),
  favoritePoint: integer("favorite_point").notNull(),
  comment: text("comment").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminSettings = sqliteTable("admin_settings", {
  id: integer("id").primaryKey(),
  surveyUrl: text("survey_url").notNull().default(""),
  point3Answers: text("point3_answers").notNull().default("[]"),
  benefits: text("benefits").notNull().default("[]"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
