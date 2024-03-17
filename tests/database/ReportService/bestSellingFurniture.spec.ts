import { expect } from "chai";
import { TransactionService } from "../../../src/database/TransactionService.js";
import { FurnitureService } from "../../../src/database/FurnitureService.js";
import { TransactionType } from "../../../src/interfaces/ITransaction.js";
import { bestSellingFurniture } from "../../../src/database/ReportService/bestSellingFurniture.js";

describe("Report Service Tests - bestSellingFurtniture", () => {
  // Setup the database before running the tests
  const transactionService = TransactionService.getInstance();
  const furnitureService = FurnitureService.getInstance();

  // Funcion asincrona que se ejecuta antes de cada test
  beforeEach(async () => {
    // Limpiamos la base de datos
    await transactionService.removeDatabase();
    await furnitureService.removeDatabase();
    // Añadimos varios muebles
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
    // Añadimos varias transacciones
    const transaction1Cliente: TransactionType = {
      id: 1,
      clientId: 1,
      date: new Date(),
      items: [furniture1, furniture2],
      total: 270,
      type: "sale",
    };
    const transaction2Cliente: TransactionType = {
      id: 2,
      clientId: 1,
      date: new Date(),
      items: [furniture2, furniture3],
      total: 370,
      type: "sale",
    };
    const transaction3Cliente: TransactionType = {
      id: 3,
      clientId: 1,
      date: new Date(),
      items: [furniture1, furniture3],
      total: 270,
      type: "sale",
    };
    await transactionService.addTransaction(transaction1Cliente);
    await transactionService.addTransaction(transaction2Cliente);
    await transactionService.addTransaction(transaction3Cliente);
  });

  describe("should get the best selling furniture", () => {
    it("getData should return 6 Furnitures", async () => {
      const report = new bestSellingFurniture();
      const bestSelling = await report.getData();
      expect(bestSelling).to.be.an("array");
      expect(bestSelling).to.have.lengthOf(6);
    });
    it("getData should return 2 Furnitures", async () => {
      // Eliminamos la transacción 3
      const transactionService = TransactionService.getInstance();
      await transactionService.removeTransaction(3);
      const report = new bestSellingFurniture();
      const bestSelling = await report.getData();
      expect(bestSelling).to.be.an("array");
      expect(bestSelling).to.have.lengthOf(2);
    });
    it("getData should return error", async () => {
      // Limpiamos las transacciones
      const transactionService = TransactionService.getInstance();
      await transactionService.removeDatabase();
      const report = new bestSellingFurniture();
      try {
        await report.getData();
      } catch (error) {
        expect(error).to.be.an("error");
      }
    });
  });
});
