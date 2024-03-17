import { ReportService } from "./ReportService.js";
import { IStock } from "../../interfaces/IStock.js";

/**
 * Represents a report service that generates a report of stock data by category.
 * @extends ReportService
 */
export class stockByCategory extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates the report data for the specified category.
   * @param {string} category - The category for which to generate the report.
   * @returns {Promise<void>} A promise that resolves when the report data is generated.
   */
  public async generateReportData(category: string): Promise<void> {
    try {
      const stockData = await this.getData(category);
      const formatData = stockData.map((stock) => {
        return {
          Nombre: this.furnitureService.getFurnitureById(stock.furniture_id)
            .name,
          Identificador: stock.furniture_id,
          Cantidad: stock.quantity,
        };
      });
      console.table(formatData);
    } catch (error) {
      console.log("Error no se ha encontrado la categoría: ", category);
    }
  }

  /**
   * Retrieves the stock data for the specified category.
   * @param {string} [category] - The category for which to retrieve the stock data. If not specified, retrieves all stock data.
   * @returns {Promise<Array<IStock>>} A promise that resolves with an array of stock data.
   * @throws {Error} If the specified category is not found.
   */
  public async getData(category?: string): Promise<Array<IStock>> {
    const stockData = this.stockService.getCollection();
    return await stockData.then((stock) => {
      const tableData = stock.filter((item) => item.category === category);
      if (tableData.length === 0) {
        throw new Error("No se ha encontrado la categoría: " + category);
      }
      return tableData;
    });
  }
}
