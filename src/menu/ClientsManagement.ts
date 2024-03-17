import inquirer from "inquirer";
import { consoleMenu, promptAddUser, waitForInput, promptSingleString } from "./common.js";
import { Stock } from "../Stock.js";

enum ClientsMenu {
  Sale = "New Sale",
  Devolution = "New Devolution",
  GetClient = "Get Client by ID",
  Add = "Add Client",
  Remove = "Remove Client",
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
  await stock.clientBuy(parseInt(answers.clientID), answers.furnitureIDs.split(" ").map(Number));
}


export function ClientsManagement() {
  const stock = new Stock();
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
          await promptSaleDetails();
          await waitForInput();
          consoleMenu();
          break;
        case ClientsMenu.Devolution:
          try {
            const transactionID = await promptSingleString("Enter the transaction ID");
            await stock.clientDevolution(parseInt(transactionID));
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ClientsMenu.GetClient:
          try {
            const clientID = await promptSingleString("Enter the client ID");
            await stock.getAClient(parseInt(clientID));
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ClientsMenu.Add:
          try {
            const answers = await promptAddUser();
            await stock.addUser(answers.name, answers.address, answers.contact, true);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ClientsMenu.Remove:
          try {
            const clientID = await promptSingleString("Enter the client ID");
            await stock.removeUser(parseInt(clientID), true);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ClientsMenu.Quit:
          consoleMenu();
          break;
      }
    });
}
