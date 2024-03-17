import { ReportService } from "./ReportService.js";
import { ITransaction } from "../../interfaces/ITransaction.js";

/**
 * Represents a report service for calculating total billing by a client.
 * @extends ReportService
 */
export class totalBillingByAClient extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates the report data for a specific client.
   * @param clientID - The ID of the client.
   * @returns A promise that resolves when the report data is generated.
   */
  public async generateReportData(clientID: string): Promise<void> {
    try {
      const clientData = await this.getData(clientID);
      let totalBilling = 0;
      clientData.forEach((transaction) => {
        totalBilling += transaction.total;
      });
      console.log(
        "Facturación total del cliente ",
        clientID,
        ": ",
        totalBilling,
      );
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  /**
   * Retrieves the transaction data for a specific client.
   * @param clientID - The ID of the client. (optional)
   * @returns An array of transactions of the client.
   * @throws Error if there are no transactions or no client is specified.
   */
  public async getData(clientID?: string): Promise<Array<ITransaction>> {
    // Obtener todas las transacciones de los clientes en un periodo de tiempo
    const clientData = await this.transactionService.getCollection();
    if (
      clientData.length === 0 ||
      clientID === undefined ||
      this.clientService.getClientById(parseInt(clientID, 10)) === undefined
    ) {
      throw new Error("No hay transacciones o el cliente no existe");
    } else {
      const clientNumber = parseInt(clientID, 10);
      if (isNaN(clientNumber)) {
        throw new Error("El cliente no es válido");
      } else {
        const clientBills: Array<ITransaction> = [];
        clientData.forEach((transaction) => {
          if (
            transaction.type === "sale" &&
            transaction.clientId === clientNumber
          ) {
            clientBills.push(transaction);
          }
        });
        return clientBills;
      }
    }
  }
}
