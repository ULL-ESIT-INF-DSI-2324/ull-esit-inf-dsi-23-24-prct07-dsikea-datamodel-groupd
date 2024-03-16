import { expect } from "chai";
import { StockService } from "../../src/database/StockService.js";
import { IStock } from "../../src/interfaces/IStock.js";

describe("Stock Service Tests", () => {
  const stockService = StockService.getInstance();
  // Remove the database file before running the tests
  before(async () => {
    await stockService.removeDatabase();
  });

  it("should create a new stock", async () => {
    const stock: IStock = {
      furniture_id: 1,
      quantity: 100,
      category: "table"
    };
    await stockService.addStock(stock);
    const stocks = await stockService.getCollection();
    expect(stocks).to.be.an("array").length(1);
  });

  it("should add stock", async () => {
    const stock: IStock = {
      furniture_id: 1,
      quantity: 100,
      category: "table"
    };
    await stockService.addStock(stock);
    const stocks = await stockService.getCollection();
    expect(stocks).to.be.an("array").length(1);
  });

  it("should get the collection of stocks", async () => {
    const collection = await stockService.getCollection();
    expect(collection).to.be.an("array");
  });

  it("should get the number of stock of a furniture by id", () => {
    const stock = stockService.getStockNumber(1);
    expect(stock).to.be.equal(200);
  });

  it("should reduce the stock of a furniture by id", async () => {
    await stockService.reduceStock(1, 50);
    const stock = await stockService.getStockById(1);
    expect(stock).to.have.property("quantity", 150);
  });

  it("should not reduce the stock if the quantity is greater than the stock", async () => {
    try {
      await stockService.reduceStock(1, 200);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Not enough stock");
      }
    }
  });
});