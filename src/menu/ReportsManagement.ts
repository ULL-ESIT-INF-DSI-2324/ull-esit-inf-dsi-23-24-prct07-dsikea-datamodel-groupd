import inquirer from "inquirer";
import { consoleMenu, promptAdd, waitForInput } from "./common.js";

enum ReportsMenu {
  ShowAll = "Show All Transactions",
  ShowClient = "Show Transactions by Client",
  ShowSupplier = "Show Transactions by Supplier",
  Quit = "Return to main menu",
}

export function ReportsManagement() {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "command",
      message: "Choose option",
      choices: Object.values(ReportsMenu),
    })
    .then(async (answers) => {
      switch (answers["command"]) {
        case ReportsMenu.ShowAll:
          "Show all transactions";
          await waitForInput();
          ReportsManagement();
          break;
        case ReportsMenu.ShowClient:
          promptAdd("Enter the name of the client");
          ReportsManagement();
          break;
        case ReportsMenu.ShowSupplier:
          promptAdd("Enter the name of the supplier");
          ReportsManagement();
          break;
        case ReportsMenu.Quit:
          consoleMenu();
          break;
      }
    });
}