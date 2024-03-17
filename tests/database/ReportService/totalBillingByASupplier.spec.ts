import { expect } from "chai";
import { totalBillingByASupplier } from "../../../src/database/ReportService/totalBillingByASupplier.js";
import { TransactionService } from "../../../src/database/TransactionService.js";
import { TransactionType } from "../../../src/interfaces/ITransaction.js";
import { FurnitureService } from "../../../src/database/FurnitureService.js";
import { SupplierService } from "../../../src/database/SupplierService.js";

describe("Report Service Tests - totalBillingByASupplier", () => {
  const supplierService = SupplierService.getInstance();
  const transactionService = TransactionService.getInstance();
  const furnitureService = FurnitureService.getInstance();

  beforeEach(async () => {
    await supplierService.removeDatabase();
    await transactionService.removeDatabase();
    await furnitureService.removeDatabase();
    // Añadir un proveedor
    await supplierService.addSupplier({
      id: 1,
      name: "John Doe",
      contact: "871",
      address: "Callenueva",
    });
    await supplierService.addSupplier({
      id: 2,
      name: "Jane Doe",
      contact: "1234567890",
      address: "Callevieja",
    });
    await supplierService.addSupplier({
      id: 3,
      name: "Pablo Motos",
      contact: "2020202",
      address: "123 Street",
    });
    // Añadir furniture
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
    // Añadir facturas
    const transaction1Supplier: TransactionType = {
      id: 1,
      supplierId: 1,
      date: new Date(),
      items: [furniture1, furniture2],
      total: 270,
      type: "purchase",
    };
    const transaction2Supplier: TransactionType = {
      id: 2,
      supplierId: 1,
      date: new Date(),
      items: [furniture2, furniture3],
      total: 370,
      type: "purchase",
    };
    const transaction3Supplier: TransactionType = {
      id: 3,
      supplierId: 2,
      date: new Date(),
      items: [furniture1, furniture3],
      total: 270,
      type: "purchase",
    };
    await transactionService.addTransaction(transaction1Supplier);
    await transactionService.addTransaction(transaction2Supplier);
    await transactionService.addTransaction(transaction3Supplier);
  });

  it("should get the total billing of the supplier 1", async () => {
    const report = new totalBillingByASupplier();
    const totalBilling = await report.getData("1");
    let total = 0;
    totalBilling.forEach((element) => {
      total += element.total;
    });
    expect(total).to.equal(640);
  });

  it("should get the total billing of the supplier 2", async () => {
    const report = new totalBillingByASupplier();
    const totalBilling = await report.getData("2");
    let total = 0;
    totalBilling.forEach((element) => {
      total += element.total;
    });
    expect(total).to.equal(270);
  });

  it("should get the total billing of the supplier 3", async () => {
    const report = new totalBillingByASupplier();
    const totalBilling = await report.getData("3");
    let total = 0;
    totalBilling.forEach((element) => {
      total += element.total;
    });
    expect(total).to.equal(0);
  });

  it("should throw an error when getting the total billing of a supplier that does not exist", async () => {
    const report = new totalBillingByASupplier();
    try {
      await report.getData("99");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});
