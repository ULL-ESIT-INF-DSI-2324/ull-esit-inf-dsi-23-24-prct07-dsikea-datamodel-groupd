import inquirer from "inquirer";
import { StockManagement } from "./StockManagement.js";
import { SuppliersManagement } from "./SuppliersManagement.js";
import { ClientsManagement } from "./ClientsManagement.js";
import { ReportsManagement } from "./ReportsManagement.js";
import { IClient } from "../interfaces/IClient.js";
import { ISupplier } from "../interfaces/ISupplier.js";

enum SubMenu {
  Clients = "Clients Management",
  Suppliers = "Suppliers Management",
  Stock = "Stock Management",
  Reports = "Reports",
  Quit = "Quit",
}

export function consoleMenu(): void {
  // Declaramos el stock
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

export function promptAddUser() {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter the name",
    },
    {
      type: "input",
      name: "address",
      message: "Enter the address",
    },
    {
      type: "input",
      name: "contact",
      message: "Enter a phone number",
    },
  ];
  const answers = inquirer.prompt(questions);
  return answers;
}

export async function promptSingleString(message: string): Promise<string> {
  const answers = await inquirer.prompt({
    type: "input",
    name: "value",
    message: message,
  });
  return answers.value;
}


export async function waitForInput() {
  await inquirer.prompt({
    type: "input",
    name: "continue",
    message: "Press enter to continue",
  });
}