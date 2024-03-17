import { expect } from "chai";
import { TransactionService } from "../../src/database/TransactionService.js";
import { TransactionType } from "../../src/interfaces/ITransaction.js";

describe("Transaction Service Tests", () => {
  const transactionService = TransactionService.getInstance();
  // Remove the database file before running the tests
  before(async () => {
    await transactionService.removeDatabase();
  });

  it("should create a new transaction", async () => {
    const transaction: TransactionType = {
      id: 1,
      clientId: 1,
      total: 100,
      items: [],
      date: new Date(),
      type: "sale",
    };
    await transactionService.addTransaction(transaction);
    const transactions = await transactionService.getCollection();
    expect(transactions).to.be.an("array").length(1);
  });

  it("should get the collection of transactions", async () => {
    const collection = await transactionService.getCollection();
    expect(collection).to.be.an("array");
  });

  it("should get a transaction by id", () => {
    const transaction = transactionService.getTransactionById(1);
    expect(transaction).to.have.property("id", 1);
  });

  it("should get a transaction by total", () => {
    const transaction = transactionService.getTransactionsByTotal(100);
    // transaction is an array of transactions
    expect(transaction[0]).to.have.property("total", 100);
  });

  it("should get a transaction by date", () => {
    const transaction = transactionService.getTransactionsByDate(new Date());
    // transaction is an array of transactions
    expect(transaction).to.be.an("array").length(1);
  });

  it("should get a transaction by type", () => {
    const transaction = transactionService.getTransactionsByType("sale");
    // transaction is an array of transactions
    expect(transaction[0]).to.have.property("type", "sale");
  });

  it("should update a transaction in the collection", async () => {
    const transaction: TransactionType = {
      id: 1,
      clientId: 1,
      total: 200,
      items: [],
      date: new Date(),
      type: "sale",
    };
    await transactionService.updateTransaction(transaction);
    const transactions = await transactionService.getCollection();
    expect(transactions[0]).to.have.property("total", 200);
  });

  it("should remove a transaction from the collection", async () => {
    await transactionService.removeTransaction(1);
    const transactions = await transactionService.getCollection();
    expect(transactions).to.be.an("array").length(0);
  });

  it("should throw an error when getting a transaction by id", () => {
    expect(() => transactionService.getTransactionById(1)).to.throw(
      "transaction not found",
    );
  });

  it("should throw an error when updating a transaction that not exists", async () => {
    const transaction: TransactionType = {
      id: 1,
      clientId: 1,
      total: 200,
      items: [],
      date: new Date(),
      type: "sale",
    };
    try {
      await transactionService.updateTransaction(transaction);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("transaction not found");
      }
    }
  });
});
