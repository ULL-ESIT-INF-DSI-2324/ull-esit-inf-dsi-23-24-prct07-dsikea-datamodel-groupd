import inquirer from "inquirer";
import { StockManagement } from "./StockManagement.js";
import { SuppliersManagement } from "./SuppliersManagement.js";
import { ClientsManagement } from "./ClientsManagement.js";
import { ReportsManagement } from "./ReportsManagement.js";

enum SubMenu {
  Stock = "Stock Management",
  Suppliers = "Suppliers Management",
  Clients = "Clients Management",
  Reports = "Reports",
  Quit = "Quit",
}

export function consoleMenu(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "command",
      message: "Choose option",
      choices: Object.values(SubMenu),
    })
    .then((answers) => {
      switch (answers["command"]) {
        case SubMenu.Stock:
          StockManagement();
          break;
        case SubMenu.Suppliers:
          SuppliersManagement();
          break;
        case SubMenu.Clients:
          ClientsManagement();
          break;
        case SubMenu.Reports:
          ReportsManagement();
          break;
      }
    });
}

export function promptAdd(message: string) {
  console.clear();
  inquirer
    .prompt({ type: "input", name: "add", message: message })
    .then((answers) => {
      if (answers["add"] !== "") {
        // collection.push([answers["add"], false]);
      }
      consoleMenu();
    });
}

export async function waitForInput() {
  await inquirer.prompt({
    type: "input",
    name: "continue",
    message: "Press enter to continue",
  });
}