import { ClientService } from "../ClientsService.js";
import { SupplierService } from "../SuppliersService.js";
import { FurnitureService } from "../FurnitureService.js";
import { StockService } from "../StockService.js";
import { TransactionService } from "../TransactionService.js";
import { IClient } from "../../interfaces/IClient.js";
import { IFurniture } from "../../interfaces/IFurniture.js";
import { IStock } from "../../interfaces/IStock.js";
import { ISupplier } from "../../interfaces/ISupplier.js";
import { ITransaction } from "../../interfaces/ITransaction.js";

/**
 * Abstract class representing a report service.
 */
export abstract class ReportService {
  protected furnitureService: FurnitureService = FurnitureService.getInstance();
  protected stockService: StockService = StockService.getInstance();
  protected clientService: ClientService = ClientService.getInstance();
  protected supplierService: SupplierService = SupplierService.getInstance();
  protected transactionService: TransactionService =
    TransactionService.getInstance();

  /**
   * Generates a report.
   * @param data - Optional data for generating the report.
   */
  public async generateReport(data?: string): Promise<void> {
    await this.generateReportData(data);
  }

  /**
   * Retrieves data for generating the report.
   * @returns A promise that resolves to an array of stock, furniture, transaction, client, or supplier objects.
   */
  public abstract getData():
    | Promise<Array<IStock>>
    | Promise<Array<IFurniture>>
    | Promise<Array<ITransaction>>
    | Promise<Array<IClient>>
    | Promise<Array<ISupplier>>;

  /**
   * Generates the report data.
   * @param data - Optional data for generating the report.
   */
  protected abstract generateReportData(data?: string): Promise<void>;
}
