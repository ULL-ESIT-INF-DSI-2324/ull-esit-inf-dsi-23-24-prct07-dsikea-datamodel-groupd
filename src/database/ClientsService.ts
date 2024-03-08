import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { IClient } from '../interfaces/Client.js';

/**
 * @class ClientService - Service to manage the client collection
 */
export class ClientService {
  private static instance: ClientService;
  private clientDB: Low<IClient[]>;

  constructor() {
    this.clientDB = new Low(new JSONFile('./data/client.json'), []);
    this.initCollection();
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
    /* istanbul ignore if */
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
    // Check if the client already exists
    const exists = this.clientDB.data.find((f) => f === client);
    if (exists) {
      throw new Error('client already exists');
    }

    // Check if the client id or name already exists
    const idExists = this.clientDB.data.find((f) => f.id === client.id || f.name === client.name);
    if (idExists) {
      throw new Error('client id already exists');
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
    this.clientDB.data = this.clientDB.data.filter((f) => f.id !== id);
    await this.clientDB.write();
  }

  /**
   * @method updateClient - Method to update a client in the collection
   * @param client {IClient} - The client to update in the collection
   * @returns {Promise<void>} - A promise that resolves when the client is updated in the collection
   */
  public async updateClient(client: IClient): Promise<void> {
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
   * @returns {Promise<IClient>} - A promise that resolves with the client
   */
  public async getClientById(id: number): Promise<IClient> {
    const client = this.clientDB.data.find((f) => f.id === id);
    if (!client) {
      throw new Error('client not found');
    }
    return client;
  }

  /**
   * @method getClientByName - Method to get a client from the collection by name
   * @param name {string} - The name of the client to get
   * @returns {Promise<IClient>} - A promise that resolves with the client
   */
  public async getClientByName(name: string): Promise<IClient> {
    const client = this.clientDB.data.find((f) => f.name === name);
    if (!client) {
      throw new Error('client not found');
    }
    return client;
  }
}
