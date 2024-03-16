import inquirer from "inquirer";
import { consoleMenu, promptAdd, waitForInput } from "./common.js";

enum ClientsMenu {
  Show = "Show Clients",
  Add = "Add Client",
  ShowHistory = "Show Client History",
  Quit = "Return to main menu",
}

export function ClientsManagement() {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "command",
      message: "Choose option",
      choices: Object.values(ClientsMenu),
    })
    .then(async (answers) => {
      switch (answers["command"]) {
        case ClientsMenu.Show:
          "Show clients";
          await waitForInput();
          ClientsManagement();
          break;
        case ClientsMenu.Add:
          promptAdd("Enter the name of the client");
          break;
        case ClientsMenu.ShowHistory:
          break;
        case ClientsMenu.Quit:
          consoleMenu();
          break;
      }
    });
}