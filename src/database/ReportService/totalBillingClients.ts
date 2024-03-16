/**
 * Represents a report service for calculating the total billing of clients.
 * Extends the base ReportService class.
 */
import { ReportService } from "./ReportService.js";
import { ITransaction } from "../../interfaces/ITransaction.js";

/**
 * Represents a report service for calculating the total billing of clients.
 * @extends ReportService
 */
export class totalBillingClients extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates the report data by calling the getData method.
   * @returns A promise that resolves when the report data is generated.
   */
  public async generateReportData(): Promise<void> {
    try {
      const billingClients = await this.getData();
      let totalBilling = 0;
      billingClients.forEach((transaction) => {
        totalBilling += transaction.total;
      });
      console.log("Facturación total de los clientes: ", totalBilling);
    } catch (error) {
      console.log("Error no se ha realizado ninguna transacción");
    }
  }

  /**
   * Retrieves the transaction data, filtering by type "sale".
   * @returns A promise that resolves with an array of transactions.
   * @throws An error if there are no transactions.
   */
  public async getData(): Promise<Array<ITransaction>> {
    const clientData = await this.transactionService.getCollection();
    if (clientData.length === 0) {
      throw new Error("No hay transacciones");
    } else {
      const billingClients: Array<ITransaction> = [];
      clientData.forEach((transaction) => {
        if (transaction.type === "sale") {
          billingClients.push(transaction);
        }
      });
      return billingClients;
    }
  }
}
