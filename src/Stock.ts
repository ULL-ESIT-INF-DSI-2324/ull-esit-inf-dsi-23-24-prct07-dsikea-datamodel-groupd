import { StockService } from "./database/StockService.js";
import { FurnitureService } from "./database/FurnitureService.js";
import { ClientService } from "./database/ClientsService.js";
import { TransactionService } from "./database/TransactionService.js";
import { IClient } from "./interfaces/IClient.js";
import { IFurniture } from "./interfaces/IFurniture.js";
import {
  IClientTransaction,
  ISupplierTransaction,
} from "./interfaces/ITransaction.js";
import { IStock } from "./interfaces/IStock.js";
import { ISupplier } from "./interfaces/ISupplier.js";
import { SupplierService } from "./database/SupplierService.js";

/**
 * Represents a Stock object.
 */
export class Stock {
  private stockService: StockService = StockService.getInstance();
  private furnitureService: FurnitureService = FurnitureService.getInstance();
  private clientService: ClientService = ClientService.getInstance();
  private transactionService: TransactionService =
    TransactionService.getInstance();
  private supplierService: SupplierService = SupplierService.getInstance();

  constructor() {}

  /**
   * @method showStock - Retrieves the stock data and displays it in a table format.
   */
  public async showStock() {
    const stockData = this.stockService.getCollection();
    // Creamos objetos que contengan id del mueble, nombre del mueble y cantidad en stock
    await stockData.then((stock) => {
      const tableData = stock.map((stock) => {
        const furniture = this.furnitureService.getFurnitureById(
          stock.furniture_id,
        );
        return {
          Nombre: furniture.name,
          Identificador: stock.furniture_id,
          Cantidad: stock.quantity,
        };
      });
      console.table(tableData);
    });
  }

  /**
   * @method clientBuy - Executes the purchase of a client given their ID and the IDs of the furniture.
   * @param {number} clientID - The ID of the client.
   * @param {number[]} furnituresID - The IDs of the furniture.
   *
   */
  public async clientBuy(clientID: number, furnituresID: number[]) {
    // Comprobamos que el cliente exista
    try {
      this.clientService.getClientById(clientID);
    } catch (error) {
      console.log("El cliente no existe");
      return;
    }

    // Comprobamos que los muebles existan
    try {
      for (const furnitureID of furnituresID) {
        this.furnitureService.getFurnitureById(furnitureID);
      }
    } catch (error) {
      console.log(error);
      return;
    }

    // Comprobamos que haya stock suficiente y vamos metiendo los muebles
    const stockService = StockService.getInstance();
    const listOfFurnitures: IFurniture[] = [];

    try {
      for (const furnitureID of furnituresID) {
        const stock = (await stockService.getStockById(furnitureID)) ?? {
          quantity: 0,
        };
        if (stock.quantity <= 0) {
          throw new Error("No hay stock suficiente");
        } else {
          listOfFurnitures.push(
            this.furnitureService.getFurnitureById(furnitureID),
          );
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

    console.log("Venta realizada con éxito");
  }

  /**
   * @method clientDevolution - Executes the devolution of a client given the transaction ID.
   * @param {number} transactionID - The ID of the transaction.
   */
  public async clientDevolution(transactionID: number) {
    // Comprobamos que la transacción exista
    try {
      this.transactionService.getTransactionById(transactionID);
    } catch (error) {
      console.log("La transacción no existe");
      return;
    }

    // Obtenemos la transacción
    const transaction =
      this.transactionService.getTransactionById(transactionID);
    // Comprobamos que la transacción sea de venta
    if (transaction.type !== "sale") {
      console.log("La transacción no es de venta");
      return;
    }

    // Añadimos el stock
    for (const furniture of transaction.items) {
      // Construimos la entidad de stock
      const stock: IStock = {
        furniture_id: furniture.id,
        quantity: 1,
        category: furniture.type,
      };
      await this.stockService.addStock(stock);
    }

    // Eliminamos la transacción
    await this.transactionService.removeTransaction(transactionID);

    // Creamos la transacción de la devolucion
    const devolution: IClientTransaction = {
      id: await this.transactionService.getNextID(),
      date: new Date(),
      items: transaction.items,
      total: transaction.total,
      clientId: transaction.clientId,
      type: "client_devolution",
    };
    this.transactionService.addTransaction(devolution);

    console.log("Devolución realizada con éxito");
  }

  /**
   * @method getAClient - Retrieves the client data given their ID and displays it in a table
   * @param {number} clientID - The ID of the client.
   */
  public async getAClient(clientID: number) {
    // Comprobamos que el cliente exista
    try {
      const client = this.clientService.getClientById(clientID);
      console.table(client);
    } catch (error) {
      console.log("El cliente no existe");
    }
  }

  /**
   * @method getAllClients - Retrieves all the clients data and displays it in a table
   * @param {string} name - The name of the client.
   * @param {string} address - The address of the client.
   * @param {string} contact - The contact of the client.
   * @param {boolean} isClient - A boolean that indicates if it is a client or a supplier.
   *
   */
  public async addUser(
    name: string,
    address: string,
    contact: string,
    isClient: boolean,
  ) {
    if (isClient) {
      const client: IClient = {
        id: await this.clientService.getNextID(),
        name: name,
        address: address,
        contact: contact,
      };
      try {
        await this.clientService.addClient(client);
        console.log("Cliente añadido con éxito");
      } catch (error) {
        console.log("Error al añadir el cliente");
      }
    } else {
      // Añadir proveedor
      const supplier: ISupplier = {
        id: await this.clientService.getNextID(),
        name: name,
        address: address,
        contact: contact,
      };
      try {
        await this.supplierService.addSupplier(supplier);
        console.log("Proveedor añadido con éxito");
      } catch (error) {
        console.log("Error al añadir el proveedor");
      }
    }
  }

  /**
   * @method removeUser - Removes a client or supplier given their ID and a boolean that indicates if it is a client or a supplier
   * @param {number} clientID - The ID of the client.
   * @param {boolean} isClient - A boolean that indicates if it is a client or a supplier.
   */
  public async removeUser(clientID: number, isClient: boolean) {
    if (isClient) {
      try {
        await this.clientService.removeClient(clientID);
        console.log("Cliente eliminado con éxito");
      } catch (error) {
        console.log("Error al eliminar el cliente");
      }
    } else {
      try {
        await this.supplierService.removeSupplier(clientID);
        console.log("Proveedor eliminado con éxito");
      } catch (error) {
        console.log("Error al eliminar el proveedor");
      }
    }
  }

  /**
   * @method supplierBuy - Executes the purchase of a supplier given their ID, the ID of the furniture and the quantity.
   * @param {number} supplierID - The ID of the supplier.
   * @param {number} furnitureID - The ID of the furniture.
   * @param {number} quantity - The quantity of the furniture.
   */
  public async supplierBuy(
    supplierID: number,
    furnitureID: number,
    quantity: number,
  ) {
    // Comprobamos que el proveedor exista
    try {
      this.clientService.getClientById(supplierID);
    } catch (error) {
      console.log("El proveedor no existe");
      return;
    }

    // Comprobamos que el mueble exista
    try {
      this.furnitureService.getFurnitureById(furnitureID);
    } catch (error) {
      console.log(error);
      return;
    }

    // Realizamos la transacción
    const transaction: ISupplierTransaction = {
      id: await this.transactionService.getNextID(),
      date: new Date(),
      items: [this.furnitureService.getFurnitureById(furnitureID)],
      total:
        this.furnitureService.getFurnitureById(furnitureID).price * quantity,
      supplierId: supplierID,
      type: "purchase",
    };

    // Añadimos la transacción
    await this.transactionService.addTransaction(transaction);

    // Añadimos el mueble al stock
    await this.stockService.addStock({
      furniture_id: furnitureID,
      quantity: quantity,
      category: this.furnitureService.getFurnitureById(furnitureID).type,
    });

    console.log("Stock añadido con éxito");
  }

  /**
   * @method supplierDevolution - Executes the devolution of a supplier given the transaction ID.
   * @param {number} transactionID - The ID of the transaction.
   */
  public async supplierDevolution(transactionID: number) {
    // Comprobamos que la transacción exista
    try {
      this.transactionService.getTransactionById(transactionID);
    } catch (error) {
      console.log("La transacción no existe");
      return;
    }

    // Obtenemos la transacción
    const transaction =
      this.transactionService.getTransactionById(transactionID);
    // Comprobamos que la transacción sea de compra
    if (transaction.type !== "purchase") {
      console.log("La transacción no es de compra");
      return;
    }

    // Vemos la cantidad de muebles que se compraron
    const quantity = transaction.items[0].price / transaction.total;

    // Eliminamos la transacción
    await this.transactionService.removeTransaction(transactionID);

    // Eliminamos el stock
    await this.stockService.reduceStock(transaction.items[0].id, quantity);

    // Creamos la transacción de la devolucion
    const devolution: ISupplierTransaction = {
      id: await this.transactionService.getNextID(),
      date: new Date(),
      items: transaction.items,
      total: transaction.total,
      supplierId: transaction.supplierId,
      type: "devolution",
    };

    this.transactionService.addTransaction(devolution);

    console.log("Devolución realizada con éxito");
  }

  /**
   * @method getASupplier - Retrieves the supplier data given their ID and displays it in a table
   * @param {number} supplierID - The ID of the supplier.
   */
  public async getASupplier(supplierID: number) {
    // Comprobamos que el proveedor exista
    try {
      const supplier = this.supplierService.getSupplierById(supplierID);
      console.table(supplier);
    } catch (error) {
      console.log("El proveedor no existe");
    }
  }

  /**
   * @method getAllSuppliers - Retrieves all the suppliers data and displays it in a table
   */
  public async showAllSuppliers() {
    const suppliers = await this.supplierService.getCollection();
    console.table(suppliers);
  }

  public async addFurniture(
    name: string,
    description: string,
    dimensions: string,
    material: string,
    price: string,
    type: string,
  ) {
    try {
      const furniture: IFurniture = {
        id: await this.furnitureService.getNextID(),
        name: name,
        description: description,
        dimensions: dimensions,
        material: material,
        price: parseInt(price),
        type: type,
      };
      await this.furnitureService.addFurniture(furniture);
      console.log("Mueble añadido con éxito");
    } catch (error) {
      console.log("Error al añadir el mueble");
    }
  }

  public async removeFurniture(furnitureID: number) {
    try {
      await this.furnitureService.removeFurniture(furnitureID);
      console.log("Mueble eliminado con éxito");
    } catch (error) {
      console.log("Error al eliminar el mueble");
    }
  }

  public async showAllClients() {
    const clients = await this.clientService.getCollection();
    console.table(clients);
  }
}
