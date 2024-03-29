import { ReportService } from "./ReportService.js";
import { ITransaction } from "../../interfaces/ITransaction.js";

/**
 * Represents a report service for calculating total billing by a supplier.
 * Extends the base ReportService class.
 */
export class totalBillingByASupplier extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates the report data for a specific supplier.
   * @param supplierID - The ID of the supplier.
   */
  public async generateReportData(supplierID: string): Promise<void> {
    try {
      const supplierData = await this.getData(supplierID);
      let totalBilling = 0;
      supplierData.forEach((transaction) => {
        totalBilling += transaction.total;
      });
      console.log(
        "Facturación total del proveedor ",
        supplierID,
        ": ",
        totalBilling,
      );
    } catch (error) {
      console.log("Error " + error);
    }
  }

  /**
   * Retrieves the data for a specific supplier.
   * @param supplierID - The ID of the supplier. Optional.
   * @returns An array of transactions of the supplier.
   * @throws Error if there are no transactions or no supplier is specified.
   * @throws Error if the supplier ID is not valid.
   */
  public async getData(supplierID?: string): Promise<Array<ITransaction>> {
    // Obtener todas las transacciones de los proveedores en un periodo de tiempo
    const supplierData = await this.transactionService.getCollection();
    if (
      supplierData.length === 0 ||
      supplierID === undefined ||
      this.supplierService.getSupplierById(parseInt(supplierID, 10)) ===
        undefined
    ) {
      throw new Error(
        "No hay transacciones o no se ha especificado un proveedor",
      );
    } else {
      // Comprobamos que el proveedor sea correcto
      const supplierNumber = parseInt(supplierID, 10);
      if (isNaN(supplierNumber)) {
        throw new Error("El numero de proveedor no es válido");
      } else {
        const supplierBills: Array<ITransaction> = [];
        supplierData.forEach((transaction) => {
          if (
            transaction.type === "purchase" &&
            transaction.supplierId === supplierNumber
          ) {
            supplierBills.push(transaction);
          }
        });
        return supplierBills;
      }
    }
  }
}
