export function add(a: number, b: number): number {
  return a + b;
}

console.log("Testing add function: ", add(1, 2));

import inquirer from "inquirer";

const collection = [
  ["Go to the gym", false],
  ["Buy some food", true],
];

function displayTodoList(): void {
  console.log("Todo list");
  if (showCompleted) {
    collection.forEach((item) =>
      console.log(item[0] + " " + (item[1] ? "Completed" : "")),
    );
  } else {
    collection.forEach((item) => {
      if (!item[1]) {
        console.log(item[0]);
      }
    });
  }
}
let showCompleted = true;

enum Commands {
  Add = "Add New Task",
  Toggle = "Show/Hide Completed",
  Quit = "Quit",
}

function promptAdd(): void {
  console.clear();
  inquirer
    .prompt({ type: "input", name: "add", message: "Enter task:" })
    .then((answers) => {
      if (answers["add"] !== "") {
        collection.push([answers["add"], false]);
      }
      testPromptUser();
    });
}

function testPromptUser(): void {
  console.clear();
  displayTodoList();
  inquirer
    .prompt({
      type: "list",
      name: "command",
      message: "Choose option",
      choices: Object.values(Commands),
    })
    .then((answers) => {
      switch (answers["command"]) {
        case Commands.Toggle:
          showCompleted = !showCompleted;
          testPromptUser();
          break;
        case Commands.Add:
          promptAdd();
          break;
      }
    });
}

// Testing database
import { FurnitureService } from "./database/FurnitureService.js";
import { IFurniture } from "./interfaces/IFurniture.js";
const furnitureService = FurnitureService.getInstance();

// console.log("Furniture collection: ", await furnitureService.getCollection());
const furniture: IFurniture = {
  id: 3,
  name: "Table3",
  description: "Wooden table",
  dimensions: "100x100x100",
  material: "Wood",
  price: 100,
  type: "test",
};

const furniture2: IFurniture = {
  id: 6,
  name: "Table5",
  description: "Wooden table",
  dimensions: "100x100x100",
  material: "Wood",
  price: 120,
  type: "test",
};
// await furnitureService.addFurniture(furniture);
// await furnitureService.addFurniture(furniture2);
// await furnitureService.removeFurniture(furniture.id);
// console.log("Furniture collection: ", await furnitureService.getCollection());

// Test add supplier
import { SupplierService } from "./database/SuppliersService.js";
import { ISupplier } from "./interfaces/ISupplier.js";
import { StockService } from "./database/StockService.js";
// const supplierService = SupplierService.getInstance();
// const supplier: ISupplier = {
//   id: 3,
//   name: "Supplier1 - 3",
//   address: "Address3",
//   contact: "1234567890",
// };

// await supplierService.addSupplier(supplier);

// console.log(
//   "Search supplier: ",
//   await supplierService.getSuppliersByName("Supplier1"),
// );

// testPromptUser();


// ---- PRUEBAS OSCAR ----

import { Stock } from "./Stock.js";

// const servicioStock = new StockService();
// await servicioStock.addStock(3, 10);
// await servicioStock.addStock(4, 10);
// await servicioStock.reduceStock(2, 5);
// await servicioStock.reduceStock(1, 5);
// await servicioStock.reduceStock(100, 5);

const stock = new Stock();
// stock.getStock();


// console.log("GOLA");


// Función que utilice en inquirer para crear un menú de 3 opciones
// 1. Agregar un nuevo al stock
// 2. Reducir el stock
// 3. Mostrar el stock
// function consoleMenu() {
//   console.clear();
//   inquirer
//     .prompt({
//       type: "list",
//       name: "command",
//       message: "Choose option",
//       choices: ["Show stock", "Quit"],
//     })
//     .then(async (answers) => {
//       switch (answers["command"]) {
//         case "Show stock":
//           // Llama a la función stock.getStock() para mostrar el stock
//           await stock.getAllStock();
//           // Espera un input del usuario antes de continuar
//           await waitForInput();
//           consoleMenu(); // Vuelve al menú principal
//           break;
//         case "Back":
//           consoleMenu(); // Vuelve al menú principal
//           break;
//         case "Quit":
//           break;
//       }
//     });
// }

// async function waitForInput() {
//   await inquirer.prompt({
//     type: "input",
//     name: "continue",
//     message: "Press enter to continue",
//   });
// }

// consoleMenu();

// -------------------------- PRUEBAS REPORT SERVICE --------------------------

import { stockByCategory } from "./database/ReportService.ts/stockByCategory.js";
import { stockByFurnitureID } from "./database/ReportService.ts/stockByFurnitureID.js";
import { bestSellingFurniture } from "./database/ReportService.ts/bestSellingFurniture.js";
import { totalBillingClients } from "./database/ReportService.ts/totalBillingClients.js";
import { totalBillingSuppliers } from "./database/ReportService.ts/totalBillingSupliers.js";
import { totalBillingClientsByYear } from "./database/ReportService.ts/totalBillingClientsByYear.js";
import { totalBillingSuppliersByYear } from "./database/ReportService.ts/totalBillingSuppliersByYear.js";
import { totalBillingByAClient } from "./database/ReportService.ts/totalBillingByAClient.js";
import { totalBillingByASupplier } from "./database/ReportService.ts/totalBillingByASupplier.js";
// DEBERÍA AÑADIRSE EL STOCK EN LA CLASE STOCK
const servicioStock = StockService.getInstance();
// servicioStock.addStock(1, 10, "Mesa");
// servicioStock.addStock(2, 10, "Silla");
// servicioStock.addStock(3, 10, "Mesa nocturna");

let report = new stockByCategory();
await report.generateReport("Table");
report = new stockByFurnitureID();
await report.generateReport("1");
await report.generateReport("100");
await report.generateReport("2");

// EMPEZAR A CLEAR TRANSACCIONES
import { TransactionService } from "./database/TransactionService.js";
import { ITransaction, IClientTransaction, ISupplierTransaction } from "./interfaces/ITransaction.js";

// const transactionService = TransactionService.getInstance();
// const  transaccion1 : IClientTransaction = {id: 1, date: new Date(), items: [furnitureService.getFurnitureById(1), furnitureService.getFurnitureById(2)], total: 270, clientId: 1, type: "sale"};
// const transaccion2 : ISupplierTransaction = {id: 2, date: new Date(), items: [furnitureService.getFurnitureById(1), furnitureService.getFurnitureById(2)], total: 270, supplierId: 1, type: "purchase"};
// transactionService.addTransaction(transaccion1);
// transactionService.addTransaction(transaccion2);

const report1 = new bestSellingFurniture();
await report1.generateReport();

let report2 = new totalBillingClients();
await report2.generateReport();
report2 = new totalBillingSuppliers();
await report2.generateReport();
let report3 = new totalBillingClientsByYear();
await report3.generateReport("2023");
await report3.generateReport("2024");
report3 = new totalBillingSuppliersByYear();
await report3.generateReport("2023");
await report3.generateReport("2024");
await report3.generateReport("2022");
// Añadimos al cliente 1 y 2
import { ClientService } from "./database/ClientsService.js";
// const cliente1 = {id: 1, name: "Cliente1", address: "Address1", contact: "1234567890"};
// const cliente2 = {id: 2, name: "Cliente2", address: "Address2", contact: "123456"};
// const clienteService = new ClientService();
// await clienteService.addClient(cliente1);
// await clienteService.addClient(cliente2);

let report4 = new totalBillingByAClient();
await report4.generateReport("1");
await report4.generateReport("2");
await report4.generateReport("3");

report4 = new totalBillingByASupplier();
await report4.generateReport("1");
await report4.generateReport("2");
await report4.generateReport("3");
