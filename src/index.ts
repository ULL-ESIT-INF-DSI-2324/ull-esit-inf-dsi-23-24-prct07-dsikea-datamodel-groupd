export function add(a: number, b: number): number {
  return a + b;
}

console.log("Testing add function: ", add(1, 2));

import inquirer from "inquirer";

const collection = [
  ["Go to the gym", false],
  ["Buy some food", true]
]

function displayTodoList(): void {
  console.log("Todo list");
  if (showCompleted) {
    collection.forEach(item => console.log(item[0] + " " + (item[1] ? "Completed" : "")));
  } else {
    collection.forEach(item => {
      if (!item[1]) {
        console.log(item[0]);
      }
    });
  }
}
let showCompleted = true;

enum Commands {
  Add = "Add New Task",
  Toggle = "Show/Hide Completed",
  Quit = "Quit"
}

function promptAdd(): void {
  console.clear();
  inquirer.prompt({ type: "input", name: "add", message: "Enter task:"})
    .then(answers => {if (answers["add"] !== "") {
      collection.push([answers["add"], false])
    }
    testPromptUser();
  })
}

function testPromptUser(): void {
  console.clear();
  displayTodoList();
  inquirer.prompt({
    type: "list",
    name: "command",
    message: "Choose option",
    choices: Object.values(Commands)
  }).then(answers => {
    switch (answers["command"]) {
      case Commands.Toggle:
        showCompleted = !showCompleted;
        testPromptUser();
        break;
      case Commands.Add:
        promptAdd();
        break;
    }
  })
}


// Testing database
import { FurnitureService } from "./database/FurnitureService.js";
import { IFurniture } from "./interfaces/Furniture.js";
const furnitureService = FurnitureService.getInstance();

console.log("Furniture collection: ", await furnitureService.getCollection());
const furniture: IFurniture = {
  id: 3,
  name: "Table3",
  description: "Wooden table",
  dimensions: "100x100x100",
  material: "Wood",
  price: 100
}

const furniture2: IFurniture = {
  id: 6,
  name: "Table5",
  description: "Wooden table",
  dimensions: "100x100x100",
  material: "Wood",
  price: 120
}
// await furnitureService.addFurniture(furniture);
// await furnitureService.addFurniture(furniture2);
await furnitureService.removeFurniture(furniture.id);
console.log("Furniture collection: ", await furnitureService.getCollection());




// testPromptUser();