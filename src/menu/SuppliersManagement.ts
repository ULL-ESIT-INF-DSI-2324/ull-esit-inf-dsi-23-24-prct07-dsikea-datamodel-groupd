import inquirer from "inquirer";
import { consoleMenu, promptSingleString, waitForInput, promptAddUser } from "./common.js";
import { Stock } from "../Stock.js";

enum SuppliersMenu {
  BuyStock = "Buy stock",
  Devolution = "Devolution to supplier",
  GetSupplier = "Get supplier by ID",
  Add = "Add supplier",
  Remove = "Remove supplier",
  Show = "Show suppliers",
  Quit = "Return to main menu",
}

async function promptBuyStock() {
  const questions = [
    {
      type: "input",
      name: "supplierID",
      message: "Enter supplier ID:",
    },
    {
      type: "input",
      name: "furnitureID",
      message: "Enter id of the furniture:",
    },
    {
      type: "input",
      name: "quantity",
      message: "Enter quantity:",
    },
  ];

  const answers = await inquirer.prompt(questions);
  // Aquí puedes hacer algo con las respuestas
  const stock = new Stock();
  await stock.supplierBuy(
    parseInt(answers.supplierID),
    parseInt(answers.furnitureID),
    parseInt(answers.quantity)
  );
}

export function SuppliersManagement() {
  const stock = new Stock();
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
        case SuppliersMenu.BuyStock:
          await promptBuyStock();
          await waitForInput();
          consoleMenu();
          break;
        case SuppliersMenu.Devolution:
          try {
            const transactionID = await promptSingleString(
              "Enter the transaction ID"
            );
            await stock.supplierDevolution(parseInt(transactionID));
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case SuppliersMenu.GetSupplier:
          try {
            const supplierID = await promptSingleString("Enter the supplier ID");
            await stock.getASupplier(parseInt(supplierID));
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case SuppliersMenu.Add:
          try {
            const answers = await promptAddUser();
            await stock.addUser(answers.name, answers.address, answers.contact, false);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case SuppliersMenu.Remove:
          try {
            const supplierID = await promptSingleString("Enter the supplier ID");
            await stock.removeUser(parseInt(supplierID), false);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case SuppliersMenu.Show:
          try {
            await stock.getAllSuppliers();
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case SuppliersMenu.Quit:
          consoleMenu();
          break;
      }
    });
}
