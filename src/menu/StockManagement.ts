import inquirer from "inquirer";
import { consoleMenu, promptAdd, waitForInput } from "./common.js";

enum StockMenu {
  Show = "Show Stock",
  Add = "Add Stock",
  Sell = "Sell Furnitures",
  Devolution = "Devolution",
  Quit = "Return to main menu"
}

export function StockManagement() {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "command",
      message: "Choose option",
      choices: Object.values(StockMenu),
    })
    .then(async (answers) => {
      switch (answers["command"]) {
        case StockMenu.Show:
          "Show stock";
          await waitForInput();
          StockManagement();
          break;
        case StockMenu.Add:
          promptAdd("Enter the name of the furniture");
          StockManagement();
          break;
        case StockMenu.Sell:
          StockManagement();
          break;
        case StockMenu.Devolution:
          StockManagement();
          break;
        case StockMenu.Quit:
          consoleMenu();
          break;
      }
    });
}