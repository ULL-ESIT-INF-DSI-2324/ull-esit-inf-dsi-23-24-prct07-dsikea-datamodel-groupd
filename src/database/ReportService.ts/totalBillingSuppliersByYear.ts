import { ReportService } from "./ReportService.js";
import { ITransaction } from "../../interfaces/ITransaction.js";

/**
 * Represents a report service for calculating the total billing of suppliers by year.
 * @extends ReportService
 */
export class totalBillingSuppliersByYear extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates the report data for the specified year.
   * @param year - The year for which to generate the report data.
   * @returns A promise that resolves when the report data is generated.
   */
  public async generateReportData(year: string): Promise<void> {
    try {
      await this.getData(year);
    } catch (error) {
      console.log("Error no se ha realizado ninguna transacción" + error);
    }
  }

  /**
   * Retrieves the transaction data and calculates the total billing for the specified year.
   * @param year - The year for which to retrieve the transaction data.
   * @returns A promise that resolves with an array of transactions.
   * @throws An error if there are no transactions or if an invalid year is specified.
   */
  public async getData(year?: string): Promise<Array<ITransaction>> {
    // Obtener todas las transacciones de los clientes en un periodo de tiempo
    const clientData = await this.transactionService.getCollection();
    if (clientData.length === 0 || year === undefined) {
      throw new Error("No hay transacciones o no se ha especificado un tiempo");
    } else {
      // Comprobamos que el año sea correcto
      const yearNumber = parseInt(year, 10);
      if (isNaN(yearNumber)) {
        throw new Error("El año no es válido");
      } else {
        // Pasar el año a una fecha
        const startDate = new Date(yearNumber, 0, 1);
        // Vamos viendo cada transacción y si es de tipo venta y está en el año que queremos, sumamos el total
        let totalBilling = 0;
        clientData.forEach((transaction) => {
          // Creamos la fecha de la transacción
          const transactionDate = new Date(transaction.date);
          if (
            transaction.type === "purchase" &&
            transactionDate.getFullYear() === startDate.getFullYear()
          ) {
            totalBilling += transaction.total;
          }
        });
        console.log(
          "Gastos totales en proveedores en el año ",
          year,
          ": ",
          totalBilling
        );
      }
    }
    return clientData;
  }
}
