import { pgTable, text, serial, numeric, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Basic user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet schema for storing crypto balances
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  currency: text("currency").notNull(),
  address: text("address").notNull(),
  balance: numeric("balance").notNull().default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction schema for payment processing
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  customerId: serial("customer_id").references(() => customers.id),
  currency: text("currency").notNull(),
  amount: numeric("amount").notNull(),
  fiatAmount: numeric("fiat_amount"),
  fiatCurrency: text("fiat_currency"),
  status: text("status").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: json("metadata"),
});

// Customer schema for tracking business customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  totalSpent: numeric("total_spent").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business metrics for dashboard
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  grossVolume: numeric("gross_volume").default("0"),
  netVolume: numeric("net_volume").default("0"),
  successfulPayments: numeric("successful_payments").default("0"),
  failedPayments: numeric("failed_payments").default("0"),
  newCustomers: numeric("new_customers").default("0"),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  totalSpent: true,
});

export const insertMetricSchema = createInsertSchema(metrics).omit({
  id: true,
});

// Types for the schema
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;
