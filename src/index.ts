export function add(a: number, b: number): number {
  return a + b;
}

console.log("Testing add function: ", add(1, 2));

import * as inquirer from "inquirer";

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
testPromptUser();