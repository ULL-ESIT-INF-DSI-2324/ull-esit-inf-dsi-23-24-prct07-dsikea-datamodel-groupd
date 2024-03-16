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
      const bestSalesData = await this.getData();
      // Teniendo todos los muebles ordenados por ventas, obtenemos el best selling furniture
      // Vemos la cantidad de veces que se ha vendido el primer mueble
      let maxSales = 0;
      let previousFurniture = bestSalesData[0].id;
      const singleFurtnitures: Array<IFurniture> = [];
      // Vemos cuantas veces se ha vendido el primer mueble
      for (let i = 0; i < bestSalesData.length; i++) {
        if (previousFurniture === bestSalesData[i].id) {
          maxSales++;
        } else {
          break;
        }
      }

      // Ahora metemos en un array los muebles una sola vez
      previousFurniture = -1;
      bestSalesData.forEach((furniture) => {
        if (furniture.id !== previousFurniture) {
          singleFurtnitures.push(furniture);
          previousFurniture = furniture.id;
        }
      });

      console.log("La cantidad de ventas del mueble más vendido es: " + maxSales);

      const formatData = singleFurtnitures.map((stock) => {
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
   * Retrieves the data for the best-selling furniture returning an array of IFurniture objects.
   * @returns A promise that resolves with an array of IFurniture objects representing the best-selling furnitures.
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

    const bestSellingFurniture = new Array<IFurniture>();
    sortedSales.forEach((value, key) => {
      if (value === maxSales) {
        for (let i = 0; i < maxSales; i++) {
          bestSellingFurniture.push(this.furnitureService.getFurnitureById(key));
        }
      }
    });
    return bestSellingFurniture;
  }
}
