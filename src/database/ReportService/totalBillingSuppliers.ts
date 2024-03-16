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
      const billingSuppliers = await this.getData();
      let totalBilling = 0;
      billingSuppliers.forEach((transaction) => {
        totalBilling += transaction.total;
      });
      console.log("Gastos totales en los proveedores: ", totalBilling);
    } catch (error) {
      console.log("Error no se ha realizado ninguna transacción");
    }
  }

  /**
   * Retrieves the transaction data and returns an array of transactions filtered by "purchase".
   * @returns A promise that resolves with an array of transactions.
   * @throws An error if there are no transactions.
   */
  public async getData(): Promise<Array<ITransaction>> {
    const supplierData = await this.transactionService.getCollection();
    if (supplierData.length === 0) {
      throw new Error("No hay transacciones");
    } else {
      const billingSupliers: Array<ITransaction> = [];
      supplierData.forEach((transaction) => {
        if (transaction.type === "purchase") {
          billingSupliers.push(transaction);
        }
      });
      return billingSupliers;
    }
  }
}
