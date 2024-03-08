import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { ISupplier } from '../interfaces/Supplier.js';

/**
 * @class SupplierService - Service to manage the Supplier collection
 */
export class SupplierService {
  private static instance: SupplierService;
  private SupplierDB: Low<ISupplier[]>;

  constructor() {
    this.SupplierDB = new Low(new JSONFile('./data/Supplier.json'), []);
    this.initCollection();
  }

  /**
   * @method getInstance - Method to get the instance of the SupplierService
   * @returns {SupplierService} - The instance of the SupplierService
   */
  public static getInstance(): SupplierService {
    if (!SupplierService.instance) {
      SupplierService.instance = new SupplierService();
    }
    return SupplierService.instance;
  }

  /**
   * @method initCollection - Method to initialize the collection of Supplier
   * @returns {Promise<void>} - A promise that resolves when the collection is initialized
   */
  private async initCollection(): Promise<void> {
    await this.SupplierDB.read();
    /* istanbul ignore if */
    if (!this.SupplierDB.data) {
      this.SupplierDB.data = [];
      await this.SupplierDB.write();
    }
  }

  /**
   * @method getCollection - Method to get the collection of Supplier
   * @returns {Promise<ISupplier[]>} - A promise that resolves with the collection of Supplier
   */
  public async getCollection(): Promise<ISupplier[]> {
    await this.SupplierDB.read();
    return this.SupplierDB.data;
  }

  /**
   * @method addSupplier - Method to add a Supplier to the collection
   * @param Supplier {ISupplier} - The Supplier to add to the collection
   * @returns {Promise<void>} - A promise that resolves when the Supplier is added to the collection
   */
  public async addSupplier(Supplier: ISupplier): Promise<void> {
    // Check if the Supplier already exists
    const exists = this.SupplierDB.data.find((f) => f === Supplier);
    if (exists) {
      throw new Error('Supplier already exists');
    }

    // Check if the Supplier id or name already exists
    const idExists = this.SupplierDB.data.find((f) => f.id === Supplier.id || f.name === Supplier.name);
    if (idExists) {
      throw new Error('Supplier id already exists');
    }

    this.SupplierDB.data.push(Supplier);
    await this.SupplierDB.write();
  }

  /**
   * @method removeSupplier - Method to remove a Supplier from the collection
   * @param id {number} - The id of the Supplier to remove
   * @returns {Promise<void>} - A promise that resolves when the Supplier is removed from the collection
   */
  public async removeSupplier(id: number): Promise<void> {
    this.SupplierDB.data = this.SupplierDB.data.filter((f) => f.id !== id);
    await this.SupplierDB.write();
  }

  /**
   * @method updateSupplier - Method to update a Supplier in the collection
   * @param Supplier {ISupplier} - The Supplier to update in the collection
   * @returns {Promise<void>} - A promise that resolves when the Supplier is updated in the collection
   */
  public async updateSupplier(Supplier: ISupplier): Promise<void> {
    this.SupplierDB.data = this.SupplierDB.data.map((f) => {
      if (f.id === Supplier.id) {
        return Supplier;
      }
      return f;
    });
    await this.SupplierDB.write();
  }

  /**
   * @method getSupplierById - Method to get a Supplier from the collection by id
   * @param id {number} - The id of the Supplier to get
   * @returns {Promise<ISupplier>} - A promise that resolves with the Supplier
   */
  public async getSupplierById(id: number): Promise<ISupplier> {
    const Supplier = this.SupplierDB.data.find((f) => f.id === id);
    if (!Supplier) {
      throw new Error('Supplier not found');
    }
    return Supplier;
  }

  /**
   * @method getSupplierByName - Method to get a Supplier from the collection by name
   * @param name {string} - The name of the Supplier to get
   * @returns {Promise<ISupplier>} - A promise that resolves with the Supplier
   */
  public async getSupplierByName(name: string): Promise<ISupplier> {
    const Supplier = this.SupplierDB.data.find((f) => f.name === name);
    if (!Supplier) {
      throw new Error('Supplier not found');
    }
    return Supplier;
  }
}
