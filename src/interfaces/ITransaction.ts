import { IFurniture } from "./IFurniture.js";

export interface ITransaction {
    id: number;
    date: Date;
    items: IFurniture[];
    total: number;
}

// Tal vez deberíamos ampliar la interfaz para incluir una transacción de cliente y proveedor y
// dividirlo en dos interfaces diferentes, algo del rollo


// NO DEFINITIVO
export interface IClientTransaction extends ITransaction {
    clientId: number;
    type: "sale" | "client_devolution";
}

// NO DEFINITIVO
export interface ISupplierTransaction extends ITransaction {
    supplierId: number;
    type: "purchase" | "devolution";
}

export type TransactionType = IClientTransaction | ISupplierTransaction;