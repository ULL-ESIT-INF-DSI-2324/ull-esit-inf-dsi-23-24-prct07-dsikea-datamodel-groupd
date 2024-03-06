import { expect } from 'chai';
import { FurnitureService } from '../../src/database/FurnitureService.js';
import { IFurniture } from '../../src/interfaces/Furniture.js';

describe('FurnitureService', () => {
  const furnitureService: FurnitureService = FurnitureService.getInstance();
  const furniture: IFurniture = {
    id: 99,
    name: "Table 1",
    description: "Wooden table",
    dimensions: "100x100x100",
    material: "Wood",
    price: 100
  };

  it('should get the collection of furniture', async () => {
    const collection = await furnitureService.getCollection();
    expect(collection).to.be.an('array');
  });

  it('should add a furniture to the collection', async () => {
    const collection = await furnitureService.getCollection();
    const length = collection.length;

    await furnitureService.addFurniture(furniture);
    const newCollection = await furnitureService.getCollection();
    expect(newCollection.length).to.equal(length + 1);
  });

  it('should remove a furniture from the collection', async () => {
    const collection = await furnitureService.getCollection();
    const length = collection.length;
    await furnitureService.removeFurniture(furniture.id);
    const newCollection = await furnitureService.getCollection();
    expect(newCollection.length).to.equal(length - 1);
  });
});