import {
  users, wallets, transactions, customers, metrics,
  type User, type InsertUser,
  type Wallet, type InsertWallet,
  type Transaction, type InsertTransaction,
  type Customer, type InsertCustomer,
  type Metric, type InsertMetric
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Wallet operations
  getWallets(userId: number): Promise<Wallet[]>;
  getWallet(id: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, balance: string): Promise<Wallet | undefined>;

  // Transaction operations
  getTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;

  // Customer operations
  getCustomers(userId: number): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomerSpend(id: number, amount: string): Promise<Customer | undefined>;
  getTopCustomers(userId: number, limit?: number): Promise<Customer[]>;

  // Metrics operations
  getMetrics(userId: number, startDate: Date, endDate: Date): Promise<Metric[]>;
  createOrUpdateMetric(metric: InsertMetric): Promise<Metric>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private customers: Map<number, Customer>;
  private metrics: Map<number, Metric>;
  private currentIds: Map<string, number>;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.customers = new Map();
    this.metrics = new Map();
    this.currentIds = new Map([
      ['users', 1],
      ['wallets', 1],
      ['transactions', 1],
      ['customers', 1],
      ['metrics', 1]
    ]);

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create a test user
    const testUser: User = {
      id: 1,
      username: 'johndoe',
      password: 'password123',
      email: 'john@example.com',
      fullName: 'John Doe',
      createdAt: new Date(),
    };
    this.users.set(testUser.id, testUser);

    // Create test wallets
    const btcWallet: Wallet = {
      id: 1,
      userId: 1,
      currency: 'BTC',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      balance: '0.0148',
      updatedAt: new Date(),
    };
    this.wallets.set(btcWallet.id, btcWallet);

    const ethWallet: Wallet = {
      id: 2,
      userId: 1,
      currency: 'ETH',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      balance: '0.25',
      updatedAt: new Date(),
    };
    this.wallets.set(ethWallet.id, ethWallet);

    const solWallet: Wallet = {
      id: 3,
      userId: 1,
      currency: 'SOL',
      address: '0x35fm3c0...',
      balance: '0.69',
      updatedAt: new Date(),
    };
    this.wallets.set(solWallet.id, solWallet);

    const optWallet: Wallet = {
      id: 4,
      userId: 1,
      currency: 'ETH',
      address: '0x35fm3c0...',
      balance: '911.00',
      updatedAt: new Date(),
    };
    this.wallets.set(optWallet.id, optWallet);

    const baseWallet: Wallet = {
      id: 5,
      userId: 1,
      currency: 'ETH',
      address: '0x35fm3c0...',
      balance: '420.00',
      updatedAt: new Date(),
    };
    this.wallets.set(baseWallet.id, baseWallet);

    // Create a test customer
    const testCustomer: Customer = {
      id: 1,
      userId: 1,
      name: 'Nate',
      email: 'nate@nathanbraun.com',
      totalSpent: '400.00',
      createdAt: new Date('2023-08-01'),
    };
    this.customers.set(testCustomer.id, testCustomer);

    // Create a test transaction
    const testTransaction: Transaction = {
      id: 1,
      userId: 1,
      customerId: 1,
      currency: 'BTC',
      amount: '0.0148',
      fiatAmount: '383.89',
      fiatCurrency: 'USD',
      status: 'completed',
      type: 'payment',
      createdAt: new Date('2023-08-03'),
      updatedAt: new Date('2023-08-03'),
      metadata: { source: 'direct_payment' },
    };
    this.transactions.set(testTransaction.id, testTransaction);

    // Create test metrics
    const today = new Date();
    const testMetric: Metric = {
      id: 1,
      userId: 1,
      date: today,
      grossVolume: '383.89',
      netVolume: '383.89',
      successfulPayments: '1',
      failedPayments: '0',
      newCustomers: '1',
    };
    this.metrics.set(testMetric.id, testMetric);
    
    // Update current IDs
    this.currentIds.set('users', 2);
    this.currentIds.set('wallets', 3);
    this.currentIds.set('transactions', 2);
    this.currentIds.set('customers', 2);
    this.currentIds.set('metrics', 2);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.get('users')!;
    this.currentIds.set('users', id + 1);
    
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date() 
    };
    
    this.users.set(id, user);
    return user;
  }

  // Wallet methods
  async getWallets(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (wallet) => wallet.userId === userId,
    );
  }

  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.currentIds.get('wallets')!;
    this.currentIds.set('wallets', id + 1);
    
    const wallet: Wallet = { 
      ...insertWallet, 
      id,
      updatedAt: new Date() 
    };
    
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWalletBalance(id: number, balance: string): Promise<Wallet | undefined> {
    const wallet = this.wallets.get(id);
    
    if (!wallet) return undefined;
    
    const updatedWallet: Wallet = {
      ...wallet,
      balance,
      updatedAt: new Date(),
    };
    
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  // Transaction methods
  async getTransactions(userId: number, limit?: number): Promise<Transaction[]> {
    const userTransactions = Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentIds.get('transactions')!;
    this.currentIds.set('transactions', id + 1);
    
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    this.transactions.set(id, transaction);
    
    // Update customer total spent
    if (transaction.customerId) {
      const customer = await this.getCustomer(transaction.customerId);
      if (customer && transaction.fiatAmount) {
        const newTotal = (parseFloat(customer.totalSpent) + parseFloat(transaction.fiatAmount.toString())).toString();
        await this.updateCustomerSpend(customer.id, newTotal);
      }
    }
    
    return transaction;
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    
    if (!transaction) return undefined;
    
    const updatedTransaction: Transaction = {
      ...transaction,
      status,
      updatedAt: new Date(),
    };
    
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Customer methods
  async getCustomers(userId: number): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(
      (customer) => customer.userId === userId,
    );
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.email === email,
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentIds.get('customers')!;
    this.currentIds.set('customers', id + 1);
    
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      totalSpent: '0',
      createdAt: new Date() 
    };
    
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomerSpend(id: number, amount: string): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    
    if (!customer) return undefined;
    
    const updatedCustomer: Customer = {
      ...customer,
      totalSpent: amount,
    };
    
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async getTopCustomers(userId: number, limit = 5): Promise<Customer[]> {
    return Array.from(this.customers.values())
      .filter((customer) => customer.userId === userId)
      .sort((a, b) => parseFloat(b.totalSpent) - parseFloat(a.totalSpent))
      .slice(0, limit);
  }

  // Metrics methods
  async getMetrics(userId: number, startDate: Date, endDate: Date): Promise<Metric[]> {
    return Array.from(this.metrics.values())
      .filter(
        (metric) => 
          metric.userId === userId && 
          metric.date >= startDate && 
          metric.date <= endDate
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createOrUpdateMetric(insertMetric: InsertMetric): Promise<Metric> {
    // Check if metric for this date already exists
    const existingMetric = Array.from(this.metrics.values()).find(
      (metric) => 
        metric.userId === insertMetric.userId && 
        metric.date.toDateString() === insertMetric.date.toDateString()
    );
    
    if (existingMetric) {
      const updatedMetric: Metric = {
        ...existingMetric,
        grossVolume: insertMetric.grossVolume || existingMetric.grossVolume,
        netVolume: insertMetric.netVolume || existingMetric.netVolume,
        successfulPayments: insertMetric.successfulPayments || existingMetric.successfulPayments,
        failedPayments: insertMetric.failedPayments || existingMetric.failedPayments,
        newCustomers: insertMetric.newCustomers || existingMetric.newCustomers,
      };
      
      this.metrics.set(existingMetric.id, updatedMetric);
      return updatedMetric;
    } else {
      const id = this.currentIds.get('metrics')!;
      this.currentIds.set('metrics', id + 1);
      
      const metric: Metric = { 
        ...insertMetric, 
        id,
      };
      
      this.metrics.set(id, metric);
      return metric;
    }
  }
}

export const storage = new MemStorage();
