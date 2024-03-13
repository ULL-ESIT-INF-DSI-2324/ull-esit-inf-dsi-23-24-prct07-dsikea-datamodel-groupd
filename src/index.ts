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
//       choices: ["Add stock", "Reduce stock", "Show stock"],
//     })
//     .then(async (answers) => {
//       switch (answers["command"]) {
//         case "Add stock":
//           // Aquí puedes implementar la lógica para agregar stock
//           break;
//         case "Reduce stock":
//           // Aquí puedes implementar la lógica para reducir stock
//           break;
//         case "Show stock":
//           // Llama a la función stock.getStock() para mostrar el stock
//           stock.getStock();
//           break;
//       }
//     });
// }

// consoleMenu();