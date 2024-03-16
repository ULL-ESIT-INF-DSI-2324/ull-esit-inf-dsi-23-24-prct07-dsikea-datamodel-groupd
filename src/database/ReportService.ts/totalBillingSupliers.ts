import { ReportService } from "./ReportService.js";
import { ITransaction } from "../../interfaces/ITransaction.js";

/**
 * Represents a report service for calculating total billing for suppliers.
 * Extends the base ReportService class.
 */
export class totalBillingSuppliers extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates the report data by calling the getData method.
   * @returns A promise that resolves when the report data is generated.
   */
  public async generateReportData(): Promise<void> {
    try {
      await this.getData();
    } catch (error) {
      console.log("Error no se ha realizado ninguna transacción");
    }
  }

  /**
   * Retrieves the transaction data and calculates the total billing for suppliers.
   * @returns A promise that resolves with an array of transactions.
   * @throws An error if there are no transactions.
   */
  public async getData(): Promise<Array<ITransaction>> {
    // Obtener la suma de todas las compras a cada proveedor
    const supplierData = await this.transactionService.getCollection();
    if (supplierData.length === 0) {
      throw new Error("No hay transacciones");
    } else {
      // Ir sumando el apartado de total de todas las transacciones que sean de tipo compra
      let totalBilling = 0;
      supplierData.forEach((transaction) => {
        if (transaction.type === "purchase") {
          totalBilling += transaction.total;
        }
      });
      console.log("Gastos totales en los proveedores: ", totalBilling);
      return supplierData;
    }
  }
}
