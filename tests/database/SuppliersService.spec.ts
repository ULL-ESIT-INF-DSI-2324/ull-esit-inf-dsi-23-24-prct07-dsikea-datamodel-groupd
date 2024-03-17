import { expect } from "chai";
import { SupplierService } from "../../src/database/SupplierService.js";
import { ISupplier } from "../../src/interfaces/ISupplier.js";

describe("Suppliers Service Tests", () => {
  const suppliersService = SupplierService.getInstance();
  // Remove the database file before running the tests
  before(async () => {
    await suppliersService.removeDatabase();
  });

  it("should create a new supplier", async () => {
    const supplier: ISupplier = {
      id: 1,
      name: "John Doe",
      contact: "1234567890",
      address: "123 Street",
    };
    await suppliersService.addSupplier(supplier);
    const suppliers = await suppliersService.getCollection();
    expect(suppliers).to.deep.include(supplier);
  });

  it("should create a new supplier", async () => {
    const supplier: ISupplier = {
      id: 2,
      name: "John",
      contact: "12345678900",
      address: "123",
    };
    await suppliersService.addSupplier(supplier);
    const suppliers = await suppliersService.getCollection();
    expect(suppliers).to.deep.include(supplier);
  });

  it("should get the collection of suppliers", async () => {
    const collection = await suppliersService.getCollection();
    expect(collection).to.be.an("array");
  });

  it("should update a supplier in the collection", async () => {
    const supplier: ISupplier = {
      id: 1,
      name: "John Doe Doe",
      contact: "1234567890",
      address: "123 Street",
    };
    await suppliersService.updateSupplier(supplier);
    const suppliers = await suppliersService.getCollection();
    expect(suppliers).to.deep.include(supplier);
  });

  it("should get a supplier by id", () => {
    const supplier = suppliersService.getSupplierById(1);
    expect(supplier).to.have.property("id", 1);
  });

  it("should get a supplier by name", () => {
    const supplier = suppliersService.getSuppliersByName("John Doe Doe");
    // supplier is an array of suppliers
    expect(supplier[0]).to.have.property("name", "John Doe Doe");
  });

  it("should get a supplier by contact", () => {
    const supplier = suppliersService.getSuppliersByContact("1234567890");
    // supplier is an array of suppliers
    expect(supplier[0]).to.have.property("contact", "1234567890");
  });

  it("should get a supplier by address", () => {
    const supplier = suppliersService.getSuppliersByAddress("123 Street");
    // supplier is an array of suppliers
    expect(supplier[0]).to.have.property("address", "123 Street");
  });

  it("should throw an error when getting a supplier by id that does not exist", () => {
    expect(() => suppliersService.getSupplierById(99)).to.throw("Supplier not found");
  });

  it("should throw an error when adding a supplier with an existing id", async () => {
    const sup: ISupplier = {
      id: 1,
      name: "Test",
      contact: "test",
      address: "test",
    };
    try {
      await suppliersService.addSupplier(sup);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Supplier id already exists");
      }
    }
  });

  it("should throw an error when adding a supplier that already exists", async () => {
    const supplier: ISupplier = {
      id: 3,
      name: 'Jon Doe Doe',
      contact: '234567890',
      address: '123 Street'
    };
    try {
      await suppliersService.addSupplier(supplier);
    } catch (error) {
      console.log("error on existing: ", error);
      if (error instanceof Error) {
        expect(error.message).to.equal("Supplier already exists");
      }
    }
  });

  it("should remove a supplier from the collection", async () => {
    await suppliersService.removeSupplier(1);
    const suppliers = await suppliersService.getCollection();
    expect(suppliers).to.not.deep.include({ id: 1 });
  });
});