import inquirer from "inquirer";
import { consoleMenu, promptAdd, waitForInput } from "./common.js";

enum SuppliersMenu {
  Show = "Show Suppliers",
  Add = "Add Supplier",
  Buy = "Buy from Supplier",
  Devolution = "Devolution",
  Quit = "Return to main menu",
}

export function SuppliersManagement() {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "command",
      message: "Choose option",
      choices: Object.values(SuppliersMenu),
    })
    .then(async (answers) => {
      switch (answers["command"]) {
        case SuppliersMenu.Show:
          "Show suppliers";
          await waitForInput();
          SuppliersManagement();
          break;
        case SuppliersMenu.Add:
          promptAdd("Enter the name of the supplier");
          break;
        case SuppliersMenu.Buy:
          break;
        case SuppliersMenu.Devolution:
          break;
        case SuppliersMenu.Quit:
          consoleMenu();
          break;
      }
    });
}
  