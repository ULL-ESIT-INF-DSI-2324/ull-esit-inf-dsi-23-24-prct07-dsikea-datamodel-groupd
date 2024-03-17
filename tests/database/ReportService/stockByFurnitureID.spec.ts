import { expect } from "chai";
import { StockService } from "../../../src/database/StockService.js";
import { FurnitureService } from "../../../src/database/FurnitureService.js";
import { stockByFurnitureID } from "../../../src/database/ReportService/stockByFurnitureID.js";



describe ("Report Service Tests - stockByFurnitureID", () => {
    const furnitureService = FurnitureService.getInstance();
    const stockService = StockService.getInstance();

    beforeEach(async () => {
        await furnitureService.removeDatabase();
        await stockService.removeDatabase();
        // utilizar el servicio de furniture para añadir algunos muebles
        const furniture1 = { id: 1, name: "Table", description: "Table of wood", price: 100, material: "Wood", dimensions: "100x100x100", type: "Table" };
        const furniture2 = { id: 2, name: "Chair", description: "Chair of wood", price: 170, material: "Wood", dimensions: "100x100x100", type: "Chair" };
        const furniture3 = { id: 3, name: "Sofa", description: "Sofa of wood", price: 200, material: "Wood", dimensions: "100x100x100", type: "Sofa" };
        const furniture4 = { id: 4, name: "Table 2", description: "Table of metal", price: 100, material: "Metal", dimensions: "100x100x100", type: "Table" };
        await furnitureService.addFurniture(furniture1);
        await furnitureService.addFurniture(furniture2);
        await furnitureService.addFurniture(furniture3);
        await furnitureService.addFurniture(furniture4);
        // Utilizar el servicio de stock para añadir stock
        await stockService.addStock({furniture_id: 1, quantity: 20, category: "Table"});
        await stockService.addStock({furniture_id: 2, quantity: 10, category: "Chair"});
        await stockService.addStock({furniture_id: 3, quantity: 5, category: "Sofa"});
        await stockService.addStock({furniture_id: 4, quantity: 5, category: "Table"});
    });

    it("should get the furniture with id 1 in the stock", async () => {
        const report = new stockByFurnitureID();
        const stock = await report.getData("1");
        expect(stock).to.be.an("array");
        expect(stock).to.have.lengthOf(1);
        expect(stock[0]).to.have.property("furniture_id", 1);
        expect(stock[0]).to.have.property("quantity", 20);
        expect(stock[0]).to.have.property("category", "Table");
    });

    it("should get the furniture with id 2 in the stock", async () => {
        const report = new stockByFurnitureID();
        const stock = await report.getData("2");
        expect(stock).to.be.an("array");
        expect(stock).to.have.lengthOf(1);
        expect(stock[0]).to.have.property("furniture_id", 2);
        expect(stock[0]).to.have.property("quantity", 10);
        expect(stock[0]).to.have.property("category", "Chair");
    });

    it("should get the furniture with id 3 in the stock", async () => {
        const report = new stockByFurnitureID();
        const stock = await report.getData("3");
        expect(stock).to.be.an("array");
        expect(stock).to.have.lengthOf(1);
        expect(stock[0]).to.have.property("furniture_id", 3);
        expect(stock[0]).to.have.property("quantity", 5);
        expect(stock[0]).to.have.property("category", "Sofa");
    });

    it("should get the furniture with id 4 in the stock", async () => {
        const report = new stockByFurnitureID();
        const stock = await report.getData("4");
        expect(stock).to.be.an("array");
        expect(stock).to.have.lengthOf(1);
        expect(stock[0]).to.have.property("furniture_id", 4);
        expect(stock[0]).to.have.property("quantity", 5);
        expect(stock[0]).to.have.property("category", "Table");
    });

    it("should throw an error when getting a furniture by id that does not exist", async () => {
        const report = new stockByFurnitureID();
        try {
            await report.getData("99");
        } catch (error) {
            expect(error).to.be.an("error");
        }
    });
});