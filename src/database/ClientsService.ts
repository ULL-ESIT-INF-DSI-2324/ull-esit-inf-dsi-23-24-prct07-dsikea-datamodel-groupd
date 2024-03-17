import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { IClient } from "../interfaces/IClient.js";

/**
 * @class ClientService - Service to manage the client collection
 */
export class ClientService {
  private static instance: ClientService;
  private clientDB: Low<IClient[]>;

  constructor() {
    const dbPath = (process.env.DB_PATH || "./data/").trim();
    this.clientDB = new Low(new JSONFile(`${dbPath}client.json`), []);
    this.initCollection();
  }

  /**
   * @method removeDatabase - Method to remove the database file
   * @returns {Promise<void>} - A promise that resolves when the database file is removed
   */
  public async removeDatabase(): Promise<void> {
    this.clientDB.data = [];
    await this.clientDB.write();
  }

  /**
   * @method getInstance - Method to get the instance of the ClientService
   * @returns {ClientService} - The instance of the ClientService
   */
  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  /**
   * @method initCollection - Method to initialize the collection of client
   * @returns {Promise<void>} - A promise that resolves when the collection is initialized
   */
  private async initCollection(): Promise<void> {
    await this.clientDB.read();
    if (!this.clientDB.data) {
      this.clientDB.data = [];
      await this.clientDB.write();
    }
  }

  /**
   * @method getCollection - Method to get the collection of client
   * @returns {Promise<IClient[]>} - A promise that resolves with the collection of client
   */
  public async getCollection(): Promise<IClient[]> {
    await this.clientDB.read();
    return this.clientDB.data;
  }

  /**
   * @method addClient - Method to add a client to the collection
   * @param client {IClient} - The client to add to the collection
   * @returns {Promise<void>} - A promise that resolves when the client is added to the collection
   */
  public async addClient(client: IClient): Promise<void> {
    await this.clientDB.read();
    // Check if the client already exists
    const exists = this.clientDB.data.find(
      (f) =>
        f.id === client.id &&
        f.name === client.name &&
        f.contact === client.contact &&
        f.address === client.address,
    );
    if (exists) {
      throw new Error("client already exists");
    }

    // Check if the client id or name already exists
    const idExists = this.clientDB.data.find(
      (f) => f.id === client.id || f.name === client.name,
    );
    if (idExists) {
      throw new Error("client id already exists");
    }

    this.clientDB.data.push(client);
    await this.clientDB.write();
  }

  /**
   * @method removeClient - Method to remove a client from the collection
   * @param id {number} - The id of the client to remove
   * @returns {Promise<void>} - A promise that resolves when the client is removed from the collection
   */
  public async removeClient(id: number): Promise<void> {
    await this.clientDB.read();
    this.clientDB.data = this.clientDB.data.filter((f) => f.id !== id);
    await this.clientDB.write();
  }

  /**
   * @method updateClient - Method to update a client in the collection
   * @param client {IClient} - The client to update in the collection
   * @returns {Promise<void>} - A promise that resolves when the client is updated in the collection
   */
  public async updateClient(client: IClient): Promise<void> {
    await this.clientDB.read();
    this.clientDB.data = this.clientDB.data.map((f) => {
      if (f.id === client.id) {
        return client;
      }
      return f;
    });
    await this.clientDB.write();
  }

  /**
   * @method getClientById - Method to get a client from the collection by id
   * @param id {number} - The id of the client to get
   * @returns {IClient} - Client that matches the id
   */
  public getClientById(id: number): IClient {
    const client = this.clientDB.data.find((f) => f.id === id);
    if (!client) {
      throw new Error("client not found");
    }
    return client;
  }

  /**
   * @method getClientsByName - Method to get clients from the collection by name (partial match)
   * @param name {string} - The name of the clients to get
   * @returns {IClient[]} - Clients that match the name
   */
  public getClientsByName(name: string): IClient[] {
    return this.clientDB.data.filter((f) => f.name.includes(name));
  }

  /**
   * @method getClientsByContact - Method to get clients from the collection by contact (partial match)
   * @param contact {string} - The contact of the clients to get
   * @returns {IClient[]} - Clients that match the contact
   */
  public getClientsByContact(contact: string): IClient[] {
    return this.clientDB.data.filter((f) => f.contact.includes(contact));
  }

  /**
   * @method getClientsByAddress - Method to get clients from the collection by address (partial match)
   * @param address {string} - The address of the clients to get
   * @returns {IClient[]} - Clients that match the address
   */
  public getClientsByAddress(address: string): IClient[] {
    return this.clientDB.data.filter((f) => f.address.includes(address));
  }

  /**
   * @method getNextID - Method to get the next id for a client
   * @returns {Promise<number>} - A promise that resolves with the next id for a client
   */
  public async getNextID(): Promise<number> {
    await this.clientDB.read();
    let nextID = 1;
    while (this.clientDB.data.find((f) => f.id === nextID)) {
      nextID++;
    }
    return nextID;
  }
}
