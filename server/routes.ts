import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import {
  insertTransactionSchema,
  insertCustomerSchema,
  insertWalletSchema,
  insertMetricSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Get wallet balances
  router.get("/wallets", async (req, res) => {
    const userId = 1; // Default user for demo
    try {
      const wallets = await storage.getWallets(userId);
      const totalBalance = wallets.reduce((sum, wallet) => {
        return sum + parseFloat(wallet.balance.toString());
      }, 0);
      
      res.json({ wallets, totalBalance });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Get a specific wallet
  router.get("/wallets/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const wallet = await storage.getWallet(id);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  // Create a new wallet
  router.post("/wallets", async (req, res) => {
    try {
      const walletData = insertWalletSchema.parse(req.body);
      const wallet = await storage.createWallet(walletData);
      res.status(201).json(wallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  // Get transactions
  router.get("/transactions", async (req, res) => {
    const userId = 1; // Default user for demo
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    try {
      const transactions = await storage.getTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get a specific transaction
  router.get("/transactions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const transaction = await storage.getTransaction(id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Create a new transaction
  router.post("/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Get customers
  router.get("/customers", async (req, res) => {
    const userId = 1; // Default user for demo
    try {
      const customers = await storage.getCustomers(userId);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Get top customers
  router.get("/customers/top", async (req, res) => {
    const userId = 1; // Default user for demo
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    try {
      const customers = await storage.getTopCustomers(userId, limit);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top customers" });
    }
  });

  // Create a new customer
  router.post("/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  // Get business metrics for dashboard
  router.get("/metrics", async (req, res) => {
    const userId = 1; // Default user for demo
    const startDate = req.query.startDate 
      ? new Date(req.query.startDate as string) 
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default to last 7 days
    
    const endDate = req.query.endDate 
      ? new Date(req.query.endDate as string) 
      : new Date();
    
    try {
      const metrics = await storage.getMetrics(userId, startDate, endDate);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Create or update metrics
  router.post("/metrics", async (req, res) => {
    try {
      const metricData = insertMetricSchema.parse(req.body);
      const metric = await storage.createOrUpdateMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create/update metric" });
    }
  });

  // Summary for today's dashboard
  router.get("/summary/today", async (req, res) => {
    const userId = 1; // Default user for demo
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);
      
      const metrics = await storage.getMetrics(userId, today, todayEnd);
      const todayMetric = metrics[0] || {
        successfulPayments: "0",
        failedPayments: "0",
        grossVolume: "0.00",
        netVolume: "0.00",
        newCustomers: "0"
      };
      
      const wallets = await storage.getWallets(userId);
      
      // Get the latest transaction date
      const transactions = await storage.getTransactions(userId, 1);
      const latestTransaction = transactions.length > 0 ? transactions[0] : null;

      // Get the latest payout info
      const payoutTransaction = transactions.find(t => t.type === 'payout');
      
      res.json({
        successfulPayments: todayMetric.successfulPayments,
        walletBalance: wallets.reduce((sum, w) => sum + parseFloat(w.balance.toString()), 0).toFixed(2),
        date: today.toISOString().split('T')[0],
        lastUpdated: new Date().toLocaleTimeString(),
        latestTransaction,
        payoutAmount: payoutTransaction ? payoutTransaction.fiatAmount : "383.89",
        payoutDate: payoutTransaction ? payoutTransaction.createdAt : new Date("2023-08-03")
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's summary" });
    }
  });

  // Business overview for the dashboard
  router.get("/summary/overview", async (req, res) => {
    const userId = 1; // Default user for demo
    const period = req.query.period || 'week'; // week, month, year
    
    try {
      const endDate = new Date();
      let startDate: Date;
      
      // Set the comparison period based on the request
      if (period === 'week') {
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
      } else if (period === 'month') {
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
      } else { // year
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
      }
      
      const metrics = await storage.getMetrics(userId, startDate, endDate);
      
      // Get top customers
      const topCustomers = await storage.getTopCustomers(userId, 5);
      
      // Calculate totals for the period
      const totals = metrics.reduce(
        (acc, metric) => {
          acc.grossVolume += parseFloat(metric.grossVolume.toString());
          acc.netVolume += parseFloat(metric.netVolume.toString());
          acc.successfulPayments += parseFloat(metric.successfulPayments.toString());
          acc.failedPayments += parseFloat(metric.failedPayments.toString());
          acc.newCustomers += parseFloat(metric.newCustomers.toString());
          return acc;
        },
        { 
          grossVolume: 0, 
          netVolume: 0, 
          successfulPayments: 0, 
          failedPayments: 0,
          newCustomers: 0
        }
      );
      
      res.json({
        period,
        metrics,
        totals,
        topCustomers,
        lastUpdated: new Date().toLocaleTimeString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business overview" });
    }
  });

  // Mount the router
  app.use("/api", router);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
