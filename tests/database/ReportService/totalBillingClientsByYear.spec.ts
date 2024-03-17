import { expect } from "chai";
import { totalBillingClientsByYear } from "../../../src/database/ReportService/totalBillingClientsByYear.js";
import { TransactionService } from "../../../src/database/TransactionService.js";
import { FurnitureService } from "../../../src/database/FurnitureService.js";
import { TransactionType } from "../../../src/interfaces/ITransaction.js";

describe("Report Service Tests - totalBillingClientsByYear", () => {
  const transactionService = TransactionService.getInstance();
  const furnitureService = FurnitureService.getInstance();

  beforeEach(async () => {
    await transactionService.removeDatabase();
    await furnitureService.removeDatabase();

    const furniture1 = {
      id: 1,
      name: "Mesa",
      description: "Mesa de madera",
      price: 100,
      material: "Madera",
      dimensions: "100x100x100",
      type: "Table",
    };
    const furniture2 = {
      id: 2,
      name: "Silla",
      description: "Silla de madera",
      price: 170,
      material: "Madera",
      dimensions: "100x100x100",
      type: "Chair",
    };
    const furniture3 = {
      id: 3,
      name: "Sofa",
      description: "Sofa de madera",
      price: 200,
      material: "Madera",
      dimensions: "100x100x100",
      type: "Sofa",
    };
    await furnitureService.addFurniture(furniture1);
    await furnitureService.addFurniture(furniture2);
    await furnitureService.addFurniture(furniture3);
    const transaction1Client: TransactionType = {
      id: 1,
      clientId: 1,
      date: new Date(2024, 2, 1),
      items: [furniture1, furniture2],
      total: 270,
      type: "sale",
    };
    const transaction2Client: TransactionType = {
      id: 2,
      clientId: 1,
      date: new Date(2024, 2, 3),
      items: [furniture2, furniture3],
      total: 370,
      type: "sale",
    };
    const transaction3Client: TransactionType = {
      id: 3,
      clientId: 2,
      date: new Date(2022, 6, 27),
      items: [furniture1, furniture3],
      total: 270,
      type: "sale",
    };
    await transactionService.addTransaction(transaction1Client);
    await transactionService.addTransaction(transaction2Client);
    await transactionService.addTransaction(transaction3Client);
  });

  it("should get 2 transactions for the year 2024", async () => {
    const report = new totalBillingClientsByYear();
    const transactions = await report.getData("2024");
    expect(transactions.length).to.equal(2);
  });

  it("should get 1 transaction for the year 2022", async () => {
    const report = new totalBillingClientsByYear();
    const transactions = await report.getData("2022");
    expect(transactions.length).to.equal(1);
  });

  it("should get 0 transactions for the year 2023", async () => {
    const report = new totalBillingClientsByYear();
    const transactions = await report.getData("2023");
    expect(transactions.length).to.equal(0);
  });

  it("should get an error if there are no transactions", async () => {
    const report = new totalBillingClientsByYear();
    try {
      await transactionService.removeDatabase();
      await report.getData("2023");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });

  it("should get an error if the year is invalid", async () => {
    const report = new totalBillingClientsByYear();
    try {
      await report.getData("202a");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});
