import { expect } from "chai";
import { totalBillingClients } from "../../../src/database/ReportService/totalBillingClients.js";
import { TransactionService } from "../../../src/database/TransactionService.js";
import { TransactionType } from "../../../src/interfaces/ITransaction.js";
import { FurnitureService } from "../../../src/database/FurnitureService.js";
import { ClientService } from "../../../src/database/ClientsService.js";

describe("Report Service Tests - totalBillingClients", () => {
  const clientService = ClientService.getInstance();
  const transactionService = TransactionService.getInstance();
  const furnitureService = FurnitureService.getInstance();

  beforeEach(async () => {
    await clientService.removeDatabase();
    await transactionService.removeDatabase();
    await furnitureService.removeDatabase();
    // Añadir un cliente
    await clientService.addClient({
      id: 1,
      name: "John Doe",
      contact: "871",
      address: "Callenueva",
    });
    await clientService.addClient({
      id: 2,
      name: "Jane Doe",
      contact: "1234567890",
      address: "Callevieja",
    });
    await clientService.addClient({
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
      clientId: 2,
      date: new Date(),
      items: [furniture1, furniture3],
      total: 270,
      type: "sale",
    };
    await transactionService.addTransaction(transaction1Cliente);
    await transactionService.addTransaction(transaction2Cliente);
    await transactionService.addTransaction(transaction3Cliente);
  });

  it("should get the total billing of the clients", async () => {
    const report = new totalBillingClients();
    const totalBilling = await report.getData();
    let total = 0;
    totalBilling.forEach((element) => {
      total += element.total;
    });
    expect(total).to.equal(910);
  });

  // Debería devolver error
  it("should return an error if there are no transactions", async () => {
    const report = new totalBillingClients();
    try {
      await transactionService.removeDatabase();
      await report.getData();
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});
