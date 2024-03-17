import { IFurniture } from "./IFurniture.js";

/**
 * @interface ITransaction - Interface for the transaction object
 */
export interface ITransaction {
  id: number;
  date: Date;
  items: IFurniture[];
  total: number;
}

/**
 * @interface IClientTransaction - Interface for the client transaction object
 */
export interface IClientTransaction extends ITransaction {
  clientId: number;
  type: "sale" | "client_devolution";
}

/**
 * @interface ISupplierTransaction - Interface for the supplier transaction object
 */
export interface ISupplierTransaction extends ITransaction {
  supplierId: number;
  type: "purchase" | "devolution";
}

/**
 * @type TransactionType - Union type for the transaction object
 */
export type TransactionType = IClientTransaction | ISupplierTransaction;
