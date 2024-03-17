import inquirer from "inquirer";
import { consoleMenu, promptAdd, waitForInput } from "./common.js";
import { Stock } from "../Stock.js";

enum ClientsMenu {
  Sale = "New Sale",
  Show = "Show Clients",
  Add = "Add Client",
  ShowHistory = "Show Client History",
  Quit = "Return to main menu",
}

async function promptSaleDetails() {
  const questions = [
    {
      type: "input",
      name: "clientID",
      message: "Enter client ID:",
    },
    {
      type: "input",
      name: "furnitureIDs",
      message: "Enter ids (leave a space between each one):",
    },
  ];

  const answers = await inquirer.prompt(questions);
  // Aquí puedes hacer algo con las respuestas
  const stock = new Stock();
  await stock.clientBuy(parseInt(answers.clientID), answers.furnitureIDs.split(" "));
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
        case ClientsMenu.Sale:
          "New sale";
          await promptSaleDetails();
          break;
        case ClientsMenu.Show:
          "Show clients";
          await waitForInput();
          ClientsManagement();
          break;
        case ClientsMenu.Add:
          promptAdd("Enter the name of the client");
          
          ClientsManagement();
          break;
        case ClientsMenu.ShowHistory:
          ClientsManagement();
          break;
        case ClientsMenu.Quit:
          consoleMenu();
          break;
      }
    });
}