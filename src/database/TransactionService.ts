import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { TransactionType } from "../interfaces/ITransaction.js";

/**
 * @class TransactionService - Service to manage the transaction collection
 */
export class TransactionService {
  private static instance: TransactionService;
  private transactionDB: Low<TransactionType[]>;

  constructor() {
    const dbPath = (process.env.DB_PATH || "./data/").trim();
    this.transactionDB = new Low(new JSONFile(`${dbPath}transaction.json`), []);
    this.initCollection();
  }

  /**
   * @method removeDatabase - Method to remove the database file
   * @returns {Promise<void>} - A promise that resolves when the database file is removed
   */
  public async removeDatabase(): Promise<void> {
    this.transactionDB.data = [];
    await this.transactionDB.write();
  }

  /**
   * @method getInstance - Method to get the instance of the TransactionService
   * @returns {TransactionService} - The instance of the TransactionService
   */
  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  /**
   * @method initCollection - Method to initialize the collection of transaction
   * @returns {Promise<void>} - A promise that resolves when the collection is initialized
   */
  private async initCollection(): Promise<void> {
    await this.transactionDB.read();

    if (!this.transactionDB.data) {
      this.transactionDB.data = [];
      await this.transactionDB.write();
    }
  }

  /**
   * @method getCollection - Method to get the collection of transaction
   * @returns {Promise<TransactionType[]>} - A promise that resolves with the collection of transaction
   */
  public async getCollection(): Promise<TransactionType[]> {
    await this.transactionDB.read();
    return this.transactionDB.data;
  }

  /**
   * @method addTransaction - Method to add a transaction to the collection
   * @param transaction {TransactionType} - The transaction to add to the collection
   * @returns {Promise<void>} - A promise that resolves when the transaction is added to the collection
   */
  public async addTransaction(transaction: TransactionType): Promise<void> {
    await this.transactionDB.read();
    this.transactionDB.data.push(transaction);
    await this.transactionDB.write();
  }

  /**
   * @method updateTransaction - Method to update a transaction in the collection
   * @param transaction {TransactionType} - The transaction to update
   * @returns {Promise<void>} - A promise that resolves when the transaction is updated in the collection
   */
  public async updateTransaction(transaction: TransactionType): Promise<void> {
    await this.transactionDB.read();
    const index = this.transactionDB.data.findIndex(
      (t) => t.id === transaction.id,
    );
    if (index < 0) {
      throw new Error("transaction not found");
    }
    this.transactionDB.data[index] = transaction;
    await this.transactionDB.write();
  }

  /**
   * @method removeTransaction - Method to remove a transaction from the collection
   * @param id {number} - The id of the transaction to remove
   * @returns {Promise<void>} - A promise that resolves when the transaction is removed from the collection
   */
  public async removeTransaction(id: number): Promise<void> {
    await this.transactionDB.read();
    this.transactionDB.data = this.transactionDB.data.filter(
      (t) => t.id !== id,
    );
    await this.transactionDB.write();
  }

  /**
   * @method getTransactionsByDate - Method to get the transactions by date (Check only the date, not the time)
   * @param date {Date} - The date to get the transactions
   * @returns {TransactionType[]} - The transactions that match the date
   */
  public getTransactionsByDate(date: Date): TransactionType[] {
    return this.transactionDB.data.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getDate() === date.getDate() &&
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      );
    });
  }

  /**
   * @method getTransactionsByType - Method to get the transactions by type
   * @param type {string} - The type to get the transactions
   * @returns {TransactionType[]} - The transactions that match the type
   */
  public getTransactionsByType(type: string): TransactionType[] {
    return this.transactionDB.data.filter((t) => t.type === type);
  }

  /**
   * @method getTransactionsByTotal - Method to get the transactions by total
   * @param total {number} - The total to get the transactions
   * @returns {TransactionType[]} -The transactions that match the total
   */
  public getTransactionsByTotal(
    total: number,
  ): TransactionType[] {
    return this.transactionDB.data.filter((t) => t.total === total);
  }

  /**
   * @method getTransactionById - Method to get a transaction from the collection by id
   * @param id {number} - The id of the transaction to get
   * @returns {TransactionType} - Transaction that matches the id
   */
  public getTransactionById(id: number): TransactionType {
    const transaction = this.transactionDB.data.find((t) => t.id === id);
    if (!transaction) {
      throw new Error("transaction not found");
    }
    return transaction;
  }
}
