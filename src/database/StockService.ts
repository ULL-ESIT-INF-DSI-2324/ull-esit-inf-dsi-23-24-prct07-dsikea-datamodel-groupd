import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { IStock } from "../interfaces/IStock.js";

/**
 * @class StockService - Service to manage the stock collection
 */
export class StockService {
  private static instance: StockService;
  private stockDB: Low<IStock[]>;

  constructor() {
    this.stockDB = new Low(new JSONFile("./data/stock.json"), []);
  }

  /**
   * @method getInstance - Method to get the instance of the StockService
   * @returns {StockService} - The instance of the StockService
   */
  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  /**
   * @method initCollection - Method to initialize the collection of stock
   * @returns {Promise<void>} - A promise that resolves when the collection is initialized
   */
  private async initCollection(): Promise<void> {
    await this.stockDB.read();
    if (!this.stockDB.data) {
      this.stockDB.data = [];
      await this.stockDB.write();
    }
  }

  /**
   * @method getCollection - Method to get the collection of stock
   * @returns {Promise<IStock[]>} - A promise that resolves with the collection of stock
   */
  public async getCollection(): Promise<IStock[]> {
    await this.stockDB.read();
    return this.stockDB.data;
  }

  /**
   * @method addStock - Method to add a stock to the collection
   * @param furniture_id {number} - The id of the stock to add
   * @param quantity {number} - The quantity of the stock to add
   * @returns {Promise<void>} - A promise that resolves when the stock is added to the collection
   */
  public async addStock(furniture_id: number, quantity: number): Promise<void> {
    await this.stockDB.read();
    const stock = this.stockDB.data.find(
      (f) => f.furniture_id === furniture_id,
    );
    if (stock) {
      stock.quantity += quantity;
    } else {
      this.stockDB.data.push({ furniture_id, quantity });
    }
  }

  /**
   * @method getStockNumber - Method to get a stock from the collection
   * @param furniture_id {number} - The id of the stock to get
   * @returns {number} - The quantity of the stock
   */
  private getStockNumber(furniture_id: number): number {
    const stockObject = this.stockDB.data.find(
      (f) => f.furniture_id === furniture_id,
    );
    return stockObject ? stockObject.quantity : 0;
  }

  /**
   * @method reduceStock - Method to reduce a stock from the collection
   * @param furniture_id {number} - The id of the stock to remove
   * @param quantity {number} - The quantity of the stock to remove
   * @returns {Promise<void>} - A promise that resolves when the stock is removed from the collection
   */
  public async reduceStock(
    furniture_id: number,
    quantity: number,
  ): Promise<void> {
    await this.stockDB.read();
    const stock = this.stockDB.data.find(
      (f) => f.furniture_id === furniture_id,
    );
    if (stock) {
      if (stock.quantity < quantity) {
        throw new Error("Not enough stock");
      }
      stock.quantity -= quantity;
    }
  }
}
