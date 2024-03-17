import { StockService } from "./database/StockService.js";
import { FurnitureService } from "./database/FurnitureService.js";
import { ClientService } from "./database/ClientsService.js";
import { TransactionService } from "./database/TransactionService.js";
import { IClient } from "./interfaces/IClient.js";
import { IFurniture } from "./interfaces/IFurniture.js";
import { IClientTransaction, ITransaction } from "./interfaces/ITransaction.js";
import { IStock } from "./interfaces/IStock.js";

/**
 * Represents a Stock object.
 */
export class Stock {
  private stockService: StockService = StockService.getInstance();
  private furnitureService: FurnitureService = FurnitureService.getInstance();
  private clientService: ClientService = ClientService.getInstance();

  constructor() {
  }

  /**
   * Retrieves the stock data and displays it in a table format.
   */
  public async getAllStock() {
    const stockData = this.stockService.getCollection();
    // Creamos objetos que contengan id del mueble, nombre del mueble y cantidad en stock
    await stockData.then((stock) => {
      const tableData = stock.map((stock) => {
        const furniture = this.furnitureService.getFurnitureById(stock.furniture_id);
        return {
          Nombre: furniture.name,
          Identificador: stock.furniture_id,
          Cantidad: stock.quantity,
        };
      });
      console.table(tableData);
    });
  }

  // Metodo que ejecuta la compra de un cliente dado su id y los ids de los muebles
  public async clientBuy(clientID: number, furnituresID: number[]) {
    // Comprobamos que el cliente exista
    try {
      const client = this.clientService.getClientById(clientID);
    } catch (error) {
      console.log("El cliente no existe");
      return;
    }

    // Comprobamos que los muebles existan
    try {
      // EL CONSOLE LOG MUESTRA BIEN LOS MUEBLES DIOS MIO QUE PASA
      // console.log(await this.furnitureService.getCollection());
      for (const furniture of furnituresID) {
        this.furnitureService.getFurnitureById(furniture);
      }
    } catch (error) {
      // console.log("Uno de los muebles no existe");
      console.log(error)
      return;
    }

    // Comprobamos que haya stock suficiente y vamos metiendo los muebles
    const stockService = StockService.getInstance();
    const listOfFurnitures: IFurniture[] = [];

    try {
      for (const furnitureID of furnituresID) {
        const stock = await stockService.getStockById(furnitureID) ?? { quantity: 0 };
        if (stock.quantity <= 0) {
          throw new Error("No hay stock suficiente");
        } else {
          listOfFurnitures.push(this.furnitureService.getFurnitureById(furnitureID));
        }
      }
    } catch (error) {
      console.log("No hay stock suficiente");
      return;
    }

    // Si se ha llegado hasta aquí, se puede realizar la venta
    // Obtenemos el precio total de los muebles
    let totalPrice = 0;
    for (const furniture of listOfFurnitures) {
      totalPrice += furniture.price;
    }

    // Actualizamos el stock
    for (const furniture of listOfFurnitures) {
      await stockService.reduceStock(furniture.id, 1);
    }

    // Creamos la transacción
    const transactionService = TransactionService.getInstance();

    const transaction: IClientTransaction = {
      id: await transactionService.getNextID(),
      date: new Date(),
      items: listOfFurnitures,
      total: totalPrice,
      clientId: clientID,
      type: "sale",
    };

    // Añadimos la transacción
    await transactionService.addTransaction(transaction);

    console.log("Venta realizada");
  }
}
