import { StockService } from "./database/StockService.js";
import { FurnitureService } from "./database/FurnitureService.js";

/**
 * Represents a Stock object.
 */
export class Stock {
    private stockService: StockService = StockService.getInstance();
    constructor() {}

    /**
     * Retrieves the stock data and displays it in a table format.
     */
    public async getStock() {
        const stockData = this.stockService.getCollection();
        // Creamos objetos que contengan id del mueble, nombre del mueble y cantidad en stock
        await stockData.then((stock) => {
            const tableData = stock.map((stock) => {
                const furnitureService = FurnitureService.getInstance();
                const furniture = furnitureService.getFurnitureById(stock.furniture_id);
                return {Nombre: furniture.name, Identificador: stock.furniture_id,  Cantidad: stock.quantity };
            });
            console.table(tableData);
        });
    }
}