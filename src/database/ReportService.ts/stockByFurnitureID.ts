import { ReportService } from "./ReportService.js";
import { IStock } from "../../interfaces/IStock.js";

/**
 * Represents a report service for retrieving stock data by furniture ID.
 * @extends ReportService
 */
export class stockByFurnitureID extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates and displays the report data for a given furniture ID.
   * @param furnitureID - The ID of the furniture.
   * @returns A promise that resolves when the report data is generated.
   */
  public async generateReportData(furnitureID: string): Promise<void> {
    try {
      const stockData = await this.getData(furnitureID);
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
      console.log(
        "Error no se ha encontrado el mueble con el id: ",
        furnitureID
      );
    }
  }

  /**
   * Retrieves the stock data for a given furniture ID.
   * @param furniture_id - The ID of the furniture.
   * @returns A promise that resolves with an array of stock data.
   * @throws If the furniture with the given ID is not found.
   */
  public async getData(furniture_id?: string): Promise<Array<IStock>> {
    const stockData = this.stockService.getCollection();
    return await stockData.then((stock) => {
      const tableData = stock.filter(
        (item) => item.furniture_id === parseInt(furniture_id as string, 10)
      );
      if (tableData.length === 0) {
        throw new Error(
          "No se ha encontrado el mueble con el id: " + furniture_id
        );
      }
      return tableData;
    });
  }
}
