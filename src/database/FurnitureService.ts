import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { IFurniture } from "../interfaces/IFurniture.js";

/**
 * @class FurnitureService - Service to manage the furniture collection
 */
export class FurnitureService {
  private static instance: FurnitureService;
  private furnitureDB: Low<IFurniture[]>;

  constructor() {
    const dbPath = (process.env.DB_PATH || "./data/").trim();
    this.furnitureDB = new Low(new JSONFile(`${dbPath}furniture.json`), []);
    this.initCollection();
  }

  /**
   * @method removeDatabase - Method to remove the database file
   * @returns {Promise<void>} - A promise that resolves when the database file is removed
   */
  public async removeDatabase(): Promise<void> {
    this.furnitureDB.data = [];
    await this.furnitureDB.write();
  }

  /**
   * @method getInstance - Method to get the instance of the FurnitureService
   * @returns {FurnitureService} - The instance of the FurnitureService
   */
  public static getInstance(): FurnitureService {
    if (!FurnitureService.instance) {
      FurnitureService.instance = new FurnitureService();
    }
    return FurnitureService.instance;
  }

  /**
   * @method initCollection - Method to initialize the collection of furniture
   * @returns {Promise<void>} - A promise that resolves when the collection is initialized
   */
  private async initCollection(): Promise<void> {
    await this.furnitureDB.read();
    if (!this.furnitureDB.data) {
      this.furnitureDB.data = [];
      await this.furnitureDB.write();
    }
  }

  /**
   * @method getCollection - Method to get the collection of furniture
   * @returns {Promise<IFurniture[]>} - A promise that resolves with the collection of furniture
   */
  public async getCollection(): Promise<IFurniture[]> {
    await this.furnitureDB.read();
    return this.furnitureDB.data;
  }

  /**
   * @method addFurniture - Method to add a furniture to the collection
   * @param furniture {IFurniture} - The furniture to add to the collection
   * @returns {Promise<void>} - A promise that resolves when the furniture is added to the collection
   */
  public async addFurniture(furniture: IFurniture): Promise<void> {
    await this.furnitureDB.read();
    // Check if the furniture already exists
    const exists = this.furnitureDB.data.find(
      (f) =>
        f.name === furniture.name &&
        f.type === furniture.type &&
        f.description === furniture.description &&
        f.dimensions === furniture.dimensions &&
        f.material === furniture.material &&
        f.price === furniture.price,
    );
    if (exists) {
      throw new Error("Furniture already exists");
    }

    // Check if the furniture id or name already exists
    const idExists = this.furnitureDB.data.find(
      (f) => f.id === furniture.id || f.name === furniture.name,
    );
    if (idExists) {
      throw new Error("Furniture id already exists");
    }

    this.furnitureDB.data.push(furniture);
    await this.furnitureDB.write();
  }

  /**
   * @method removeFurniture - Method to remove a furniture from the collection
   * @param id {number} - The id of the furniture to remove
   * @returns {Promise<void>} - A promise that resolves when the furniture is removed from the collection
   */
  public async removeFurniture(id: number): Promise<void> {
    await this.furnitureDB.read();
    this.furnitureDB.data = this.furnitureDB.data.filter((f) => f.id !== id);
    await this.furnitureDB.write();
  }

  /**
   * @method updateFurniture - Method to update a furniture in the collection
   * @param furniture {IFurniture} - The furniture to update in the collection
   * @returns {Promise<void>} - A promise that resolves when the furniture is updated in the collection
   */
  public async updateFurniture(furniture: IFurniture): Promise<void> {
    await this.furnitureDB.read();
    this.furnitureDB.data = this.furnitureDB.data.map((f) => {
      if (f.id === furniture.id) {
        return furniture;
      }
      return f;
    });
    await this.furnitureDB.write();
  }

  /**
   * @method getFurnitureById - Method to get a furniture from the collection by id
   * @param id {number} - The id of the furniture to get
   * @returns {IFurniture} - The furniture that matches the id
   */
  public getFurnitureById(id: number): IFurniture {
    const furniture = this.furnitureDB.data.find((f) => f.id === id);
    if (!furniture) {
      throw new Error("Furniture not found");
    }
    return furniture;
  }

  /**
   * @method getFurnituresByName - Method to get furnitures from the collection by name (partial match)
   * @param name {string} - The name of the furniture to get
   * @returns {IFurniture[]} - Furnitures that match the name
   */
  public getFurnituresByName(name: string): IFurniture[] {
    return this.furnitureDB.data.filter((f) => f.name.includes(name));
  }

  /**
   * @method getFurnituresByCategory - Method to get furnitures from the collection by type
   * @param type {string} - The category of the furniture to get
   * @returns {IFurniture[]} - Furnitures that match the category
   */
  public getFurnituresByCategory(type: string): IFurniture[] {
    return this.furnitureDB.data.filter((f) => f.type === type);
  }

  /**
   * @method getFurnituresByDescription - Method to get furnitures from the collection by description (partial match)
   * @param description {string} - The description of the furniture to get
   * @returns {IFurniture[]} - Furnitures that match the description
   */
  public getFurnituresByDescription(description: string): IFurniture[] {
    return this.furnitureDB.data.filter((f) =>
      f.description.includes(description),
    );
  }

  
  /**
   * Retrieves the next available ID for a furniture item.
   * 
   * @returns A Promise that resolves to the next available ID.
   */
  public async getNextID(): Promise<number> {
    await this.furnitureDB.read();
    let id: number = 1;
    while (this.furnitureDB.data.find((f) => f.id === id)) {
      id++;
    }
    return id;
  }
}
