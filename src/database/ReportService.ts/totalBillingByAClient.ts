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
      await this.getData(clientID);
    } catch (error) {
      console.log("Error no se ha realizado ninguna transacción" + error);
    }
  }

  /**
   * Retrieves the transaction data for a specific client.
   * @param clientID - The ID of the client. (optional)
   * @returns An array of transactions for the client.
   * @throws Error if there are no transactions or no client is specified.
   */
  public async getData(clientID?: string): Promise<Array<ITransaction>> {
    // Obtener todas las transacciones de los clientes en un periodo de tiempo
    const clientData = await this.transactionService.getCollection();
    if (clientData.length === 0 || clientID === undefined) {
      throw new Error(
        "No hay transacciones o no se ha especificado un cliente",
      );
    } else {
      // Comprobamos que el cliente sea correcto
      const clientNumber = parseInt(clientID, 10);
      if (isNaN(clientNumber)) {
        throw new Error("El cliente no es válido");
      } else {
        // Vamos viendo cada transacción y si es de tipo venta y está en el año que queremos, sumamos el total
        let totalBilling = 0;
        clientData.forEach((transaction) => {
          if (
            transaction.type === "sale" &&
            transaction.clientId === clientNumber
          ) {
            totalBilling += transaction.total;
          }
        });
        console.log(
          "Facturación total del cliente ",
          clientID,
          "con nombre: ",
          this.clientService.getClientById(clientNumber).name,
          ": ",
          totalBilling,
        );
      }
    }
    return clientData;
  }
}
