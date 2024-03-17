import { expect } from "chai";
import { StockService } from "../../../src/database/StockService.js";
import { FurnitureService } from "../../../src/database/FurnitureService.js";
import { stockByCategory } from "../../../src/database/ReportService/stockByCategory.js";

describe("Report Service Tests - stockByCategory", () => {
  const furnitureService = FurnitureService.getInstance();
  const stockService = StockService.getInstance();

  beforeEach(async () => {
    await furnitureService.removeDatabase();
    await stockService.removeDatabase();
    // utilizar el servicio de furniture para añadir algunos muebles
    const furniture1 = {
      id: 1,
      name: "Table",
      description: "Table of wood",
      price: 100,
      material: "Wood",
      dimensions: "100x100x100",
      type: "Table",
    };
    const furniture2 = {
      id: 2,
      name: "Chair",
      description: "Chair of wood",
      price: 170,
      material: "Wood",
      dimensions: "100x100x100",
      type: "Chair",
    };
    const furniture3 = {
      id: 3,
      name: "Sofa",
      description: "Sofa of wood",
      price: 200,
      material: "Wood",
      dimensions: "100x100x100",
      type: "Sofa",
    };
    const furniture4 = {
      id: 4,
      name: "Table 2",
      description: "Table of metal",
      price: 100,
      material: "Metal",
      dimensions: "100x100x100",
      type: "Table",
    };
    await furnitureService.addFurniture(furniture1);
    await furnitureService.addFurniture(furniture2);
    await furnitureService.addFurniture(furniture3);
    await furnitureService.addFurniture(furniture4);
    // Utilizar el servicio de stock para añadir stock
    await stockService.addStock({
      furniture_id: 1,
      quantity: 20,
      category: "Table",
    });
    await stockService.addStock({
      furniture_id: 2,
      quantity: 10,
      category: "Chair",
    });
    await stockService.addStock({
      furniture_id: 3,
      quantity: 5,
      category: "Sofa",
    });
    await stockService.addStock({
      furniture_id: 4,
      quantity: 5,
      category: "Table",
    });
  });

  describe("should get the stock data by category", () => {
    it("getData should have 2 items", async () => {
      const report = new stockByCategory();
      const stock = await report.getData("Table");
      report.generateReport("Table");
      expect(stock).to.be.an("array");
      expect(stock).to.have.lengthOf(2);
    });
    it("getData should have 1 item", async () => {
      const report = new stockByCategory();
      const stock = await report.getData("Chair");
      expect(stock).to.be.an("array");
      expect(stock).to.have.lengthOf(1);
    });
    it("getData should return error", async () => {
      const report = new stockByCategory();
      try {
        await report.getData("test");
      } catch (error) {
        expect(error).to.be.an("error");
      }
    });
  });
});
