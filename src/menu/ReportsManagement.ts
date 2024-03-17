import inquirer from "inquirer";
import { consoleMenu, waitForInput, promptSingleString } from "./common.js";
import { bestSellingFurniture } from "../database/ReportService/bestSellingFurniture.js";
import { stockByCategory } from "../database/ReportService/stockByCategory.js";
import { stockByFurnitureID } from "../database/ReportService/stockByFurnitureID.js";
import { totalBillingByAClient } from "../database/ReportService/totalBillingByAClient.js";
import { totalBillingByASupplier } from "../database/ReportService/totalBillingByASupplier.js";
import { totalBillingClients } from "../database/ReportService/totalBillingClients.js";
import { totalBillingClientsByYear } from "../database/ReportService/totalBillingClientsByYear.js";
import { totalBillingSuppliers } from "../database/ReportService/totalBillingSuppliers.js";
import { totalBillingSuppliersByYear } from "../database/ReportService/totalBillingSuppliersByYear.js";

/**
 * Enum representing the options in the Reports menu.
 */
enum ReportsMenu {
  stockByCategory = "Show All stock by Category",
  stockByAnID = "Show all stock by a furniture ID",
  bestSellingFurnitures = "Show best selling furnitures",
  totalBillingClients = "Show total billing of clients",
  totalBillingSuppliers = "Show total billing of suppliers",
  totalBillingByAClient = "Show total billing by a given client id",
  totalBillingByASupplier = "Show total billing by a given supplier id",
  totalBillingClientsByYear = "Show total billing of clients by a given year",
  totalBillingSuppliersByYear = "Show total billing of suppliers by a given year",
  Quit = "Return to main menu",
}

/**
 * Function that handles the Reports Management menu.
 * It prompts the user to choose an option from the ReportsMenu enum.
 */
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
        case ReportsMenu.stockByCategory:
          try {
            const category = await promptSingleString("Enter the category to search");
            const reporter = new stockByCategory();
            await reporter.generateReport(category);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.stockByAnID:
          try {
            const id = await promptSingleString("Enter the furniture ID to search");
            const reporter = new stockByFurnitureID();
            await reporter.generateReport(id);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.bestSellingFurnitures:
          try {
            const reporter = new bestSellingFurniture();
            await reporter.generateReport();
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.totalBillingClients:
          try {
            const reporter = new totalBillingClients();
            await reporter.generateReport();
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.totalBillingSuppliers:
          try {
            const reporter = new totalBillingSuppliers();
            await reporter.generateReport();
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.totalBillingByAClient:
          try {
            const id = await promptSingleString("Enter the client ID to search");
            const reporter = new totalBillingByAClient();
            await reporter.generateReport(id);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.totalBillingByASupplier:
          try {
            const id = await promptSingleString("Enter the supplier ID to search");
            const reporter = new totalBillingByASupplier();
            await reporter.generateReport(id);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.totalBillingClientsByYear:
          try {
            const year = await promptSingleString("Enter the year to search");
            const reporter = new totalBillingClientsByYear();
            await reporter.generateReport(year);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.totalBillingSuppliersByYear:
          try {
            const year = await promptSingleString("Enter the year to search");
            const reporter = new totalBillingSuppliersByYear();
            await reporter.generateReport(year);
            await waitForInput();
            consoleMenu();
          } catch (error) {
            console.log(error);
            await waitForInput();
            consoleMenu();
          }
          break;
        case ReportsMenu.Quit:
          consoleMenu();
          break;
      }
    });
}
