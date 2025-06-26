import { pgTable, text, serial, integer, boolean, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull().default("Quiz de Estilo"),
  description: text("description"),
  active: boolean("active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const style_types = pgTable("style_types", {
  id: text("id").primaryKey(), // Using text for codes like "elegante", "romantico"
  name: text("name").notNull(),
  description: text("description"),
  color_primary: text("color_primary"),
  color_secondary: text("color_secondary"),
  created_at: timestamp("created_at").defaultNow(),
});

export const quiz_questions = pgTable("quiz_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quiz_id: uuid("quiz_id").references(() => quizzes.id),
  title: text("title").notNull(),
  type: text("type").notNull().default("single-choice"),
  order_index: integer("order_index").notNull(),
  required_selections: integer("required_selections").default(1),
  active: boolean("active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const question_options = pgTable("question_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  question_id: uuid("question_id").references(() => quiz_questions.id),
  text: text("text").notNull(),
  image_url: text("image_url"),
  points: integer("points"),
  style_code: text("style_code").references(() => style_types.id),
  order_index: integer("order_index").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const quiz_participants = pgTable("quiz_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  quiz_id: uuid("quiz_id").references(() => quizzes.id),
  name: text("name"),
  email: text("email"),
  utm_source: text("utm_source"),
  utm_medium: text("utm_medium"),
  utm_campaign: text("utm_campaign"),
  created_at: timestamp("created_at").defaultNow(),
});

export const participant_answers = pgTable("participant_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  participant_id: uuid("participant_id").references(() => quiz_participants.id),
  question_id: uuid("question_id").references(() => quiz_questions.id),
  option_id: uuid("option_id").references(() => question_options.id),
  points: integer("points"),
  created_at: timestamp("created_at").defaultNow(),
});

export const style_results = pgTable("style_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  participant_id: uuid("participant_id").references(() => quiz_participants.id),
  style_type_id: text("style_type_id").references(() => style_types.id),
  points: integer("points"),
  percentage: numeric("percentage", { precision: 5, scale: 2 }),
  rank: integer("rank"),
  is_primary: boolean("is_primary").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const utm_analytics = pgTable("utm_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  participant_id: uuid("participant_id").references(() => quiz_participants.id),
  utm_source: text("utm_source"),
  utm_medium: text("utm_medium"),
  utm_campaign: text("utm_campaign"),
  utm_content: text("utm_content"),
  utm_term: text("utm_term"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type StyleType = typeof style_types.$inferSelect;
export type QuizQuestion = typeof quiz_questions.$inferSelect;
export type QuestionOption = typeof question_options.$inferSelect;
export type QuizParticipant = typeof quiz_participants.$inferSelect;
export type ParticipantAnswer = typeof participant_answers.$inferSelect;
export type StyleResult = typeof style_results.$inferSelect;
export type UtmAnalytics = typeof utm_analytics.$inferSelect;
