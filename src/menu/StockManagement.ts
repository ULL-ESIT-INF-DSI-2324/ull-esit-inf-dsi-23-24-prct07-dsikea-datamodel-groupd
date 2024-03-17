import inquirer from "inquirer";
import { consoleMenu, waitForInput } from "./common.js";
import { Stock } from "../Stock.js";
import { promptSingleString } from "./common.js";

enum StockMenu {
  Show = "Show Stock",
  AddFurtniture = "Add furniture",
  RemoveFurniture = "Remove furniture",
  Quit = "Return to main menu",
}

/**
 * Stock management menu
 */
export function StockManagement() {
  const stock = new Stock();
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
          try {
            await stock.showStock();
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case StockMenu.AddFurtniture:
          try {
            await promptAddFurniture();
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case StockMenu.RemoveFurniture:
          try {
            const furnitureID = await promptSingleString(
              "Enter the furniture ID",
            );
            await stock.removeFurniture(parseInt(furnitureID));
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case StockMenu.Quit:
          consoleMenu();
          break;
      }
    });
}

async function promptAddFurniture() {
  // Preguntar por nombre, descripción, dimensiones, precio, material y tipo
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter the name",
    },
    {
      type: "input",
      name: "description",
      message: "Enter the description of the furniture",
    },
    {
      type: "input",
      name: "dimensions",
      message: "Enter the dimensions (aXbXc)",
    },
    {
      type: "input",
      name: "material",
      message: "Enter the material",
    },
    {
      type: "number",
      name: "price",
      message: "Enter the price",
    },
    {
      type: "input",
      name: "type",
      message: "Enter the type of the furniture",
    },
  ];
  const answers = await inquirer.prompt(questions);
  const stock = new Stock();
  await stock.addFurniture(
    answers.name,
    answers.description,
    answers.dimensions,
    answers.material,
    answers.price,
    answers.type,
  );
}
