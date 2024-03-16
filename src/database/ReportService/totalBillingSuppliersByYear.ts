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
      const suppliersYear = await this.getData(year);
      let totalBilling = 0;
      suppliersYear.forEach((transaction) => {
        totalBilling += transaction.total;
      });
      console.log(
        "Facturación total de los proveedores en el año ",
        year,
        ": ",
        totalBilling
      );
    } catch (error) {
      console.log("Error no se ha realizado ninguna transacción" + error);
    }
  }

  /**
   * Retrieves the transaction data and give an array of transactions for the specified year.
   * @param year - The year for which to retrieve the transaction data.
   * @returns A promise that resolves with an array of transactions.
   * @throws An error if there are no transactions or if an invalid year is specified.
   */
  public async getData(year?: string): Promise<Array<ITransaction>> {
    const clientData = await this.transactionService.getCollection();
    if (clientData.length === 0 || year === undefined) {
      throw new Error("No hay transacciones o no se ha especificado un tiempo");
    } else {
      const yearNumber = parseInt(year, 10);
      if (isNaN(yearNumber)) {
        throw new Error("El formato del año no es válido");
      } else {
        const startDate = new Date(yearNumber, 0, 1);
        const suppliersByYear: Array<ITransaction> = [];
        clientData.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          if (
            transaction.type === "purchase" &&
            transactionDate.getFullYear() === startDate.getFullYear()
          ) {
            suppliersByYear.push(transaction);
          }
        });
        return suppliersByYear;
      }
    }
  }
}
