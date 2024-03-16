import { ReportService } from "./ReportService.js";
import { IFurniture } from "../../interfaces/IFurniture.js";

/**
 * Represents a class that generates a report of the best-selling furniture.
 * @extends ReportService
 */
export class bestSellingFurniture extends ReportService {
  constructor() {
    super();
  }

  /**
   * Generates the report data for the best-selling furniture.
   * @returns A promise that resolves when the report data is generated.
   */
  public async generateReportData(): Promise<void> {
    try {
      const stockData = await this.getData();
      const formatData = stockData.map((stock) => {
        return {
          Nombre: stock.name,
          Identificador: stock.id,
          Precio: stock.price,
          Muebles_restantes: this.stockService.getStockNumber(stock.id),
        };
      });
      console.table(formatData);
    } catch (error) {
      console.log("Error no se ha encontrado el mueble con el id: ");
    }
  }

  /**
   * Retrieves the data for the best-selling furniture.
   * @returns A promise that resolves with an array of IFurniture objects representing the best-selling furniture.
   * @throws An error if there are no transactions.
   */
  public async getData(): Promise<Array<IFurniture>> {
    const stockData = await this.transactionService.getCollection();
    if (stockData.length === 0) {
      throw new Error("No hay transacciones");
    }
    const totalSales = new Map<number, number>();
    stockData.forEach((transaction) => {
      if (transaction.type === "sale") {
        transaction.items.forEach((item) => {
          if (totalSales.has(item.id)) {
            const currentSales = totalSales.get(item.id);
            if (currentSales !== undefined) {
              totalSales.set(item.id, currentSales + 1);
            }
          } else {
            totalSales.set(item.id, 1);
          }
        });
      }
    });
    const sortedSales = new Map(
      [...totalSales.entries()].sort((a, b) => b[1] - a[1])
    );
    const maxSales = sortedSales.values().next().value;

    console.log("Cantidad de muebles vendidos: ", maxSales);

    const bestSellingFurniture = new Array<IFurniture>();
    sortedSales.forEach((value, key) => {
      if (value === maxSales) {
        bestSellingFurniture.push(this.furnitureService.getFurnitureById(key));
      }
    });
    return bestSellingFurniture;
  }
}
