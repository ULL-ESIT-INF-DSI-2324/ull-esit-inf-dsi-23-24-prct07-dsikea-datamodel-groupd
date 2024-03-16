import { expect } from "chai";
import { FurnitureService } from "../../src/database/FurnitureService.js";
import { IFurniture } from "../../src/interfaces/IFurniture.js";

describe("FurnitureService Tests", () => {
  const furnitureService: FurnitureService = FurnitureService.getInstance();
  // Remove the database file before running the tests
  before(async () => {
    await furnitureService.removeDatabase();
  });

  const furniture: IFurniture = {
    id: 99,
    name: "Table 1",
    description: "Wooden table",
    dimensions: "100x100x100",
    material: "Wood",
    price: 100,
    type: "Table",
  };

  it("should get the collection of furniture", async () => {
    const collection = await furnitureService.getCollection();
    expect(collection).to.be.an("array");
  });

  it("should add a furniture to the collection", async () => {
    const collection = await furnitureService.getCollection();
    const length = collection.length;

    await furnitureService.addFurniture(furniture);
    const newCollection = await furnitureService.getCollection();
    expect(newCollection.length).to.equal(length + 1);
  });

  it("should remove a furniture from the collection", async () => {
    const collection = await furnitureService.getCollection();
    const length = collection.length;
    await furnitureService.removeFurniture(furniture.id);
    const newCollection = await furnitureService.getCollection();
    expect(newCollection.length).to.equal(length - 1);
  });

  it("should update a furniture in the collection", async () => {
    const newFurniture: IFurniture = {
      id: 99,
      name: "Table 2",
      description: "Wooden table",
      dimensions: "100x100x100",
      material: "Wood",
      price: 100,
      type: "Table",
    };
    await furnitureService.addFurniture(furniture);
    await furnitureService.updateFurniture(newFurniture);
    const collection = await furnitureService.getCollection();
    expect(collection).to.deep.include(newFurniture);
  });

  it("should get a furniture by id", () => {
    const furniture = furnitureService.getFurnitureById(99);
    expect(furniture).to.have.property("id", 99);
  });

  it("should get a furniture by name", () => {
    const furniture = furnitureService.getFurnituresByName("Table 2");
    // furniture is an array of furniture
    expect(furniture[0]).to.have.property("name", "Table 2");
  });

  it("should get a furniture by category", () => {
    const furniture = furnitureService.getFurnituresByCategory("Table");
    // furniture is an array of furniture
    expect(furniture[0]).to.have.property("type", "Table");
  });

  it("should get the furnitures by description", () => {
    const furniture =
      furnitureService.getFurnituresByDescription("Wooden table");
    // furniture is an array of furniture
    expect(furniture[0]).to.have.property("description", "Wooden table");
  });

  it("should throw an error when getting a furniture by id that does not exist", () => {
    expect(() => furnitureService.getFurnitureById(999)).to.throw(
      "Furniture not found",
    );
  });

  it("should throw an error when getting a furniture by name that does not exist", () => {
    try {
      furnitureService.getFurnituresByName("Chair 3");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Furnitures not found");
      }
    }
  });

  it("should throw an error when getting a furniture by category that does not exist", () => {
    try {
      furnitureService.getFurnituresByCategory("Chair");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Furnitures not found");
      }
    }
  });

  it("should throw an error when getting a furniture by description that does not exist", () => {
    try {
      furnitureService.getFurnituresByDescription("Metal chair");
    } catch (error) {
      if (error instanceof Error) {
        console.log("ERROR DESCRIPTION");
        expect(error.message).to.equal("Furnitures not found");
      }
    }
  });

  it("should throw an error when adding a furniture that already exists", async () => {
    const furn: IFurniture = {
      id: 99,
      name: "Table 2",
      description: "Wooden table",
      dimensions: "100x100x100",
      material: "Wood",
      price: 100,
      type: "Table",
    };

    try {
      await furnitureService.addFurniture(furn);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Furniture already exists");
      }
    }
  });

  it("should throw an error when adding a furniture with an existing id", async () => {
    const furniture: IFurniture = {
      id: 99,
      name: "Table 3",
      description: "Wooden table",
      dimensions: "100x100x100",
      material: "Wood",
      price: 100,
      type: "Table",
    };
    try {
      await furnitureService.addFurniture(furniture);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Furniture id already exists");
      }
    }
  });

  it("should throw an error when getting a furniture by name that does not exist", () => {
    try {
      furnitureService.getFurnituresByName("Table 3");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Furnitures not found");
      }
    }
  });
});
