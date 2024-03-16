import { expect } from "chai";
import { ClientService } from "../../src/database/ClientsService.js";
import { IClient } from "../../src/interfaces/IClient.js";

describe("Client Service Tests", () => {
  const clientService = ClientService.getInstance();
  // Remove the database file before running the tests
  before(async () => {
    await clientService.removeDatabase();
  });

  it("should create a new client", async () => {
    const client: IClient = {
      id: 1,
      name: "John Doe",
      contact: "1234567890",
      address: "123 Street",
    };
    await clientService.addClient(client);
    const clients = await clientService.getCollection();
    expect(clients).to.deep.include(client);
  });

  it("should get the collection of clients", async () => {
    const collection = await clientService.getCollection();
    expect(collection).to.be.an("array");
  });

  it("should update a client in the collection", async () => {
    const client: IClient = {
      id: 1,
      name: "John Doe Doe",
      contact: "1234567890",
      address: "123 Street",
    };
    await clientService.updateClient(client);
    const clients = await clientService.getCollection();
    expect(clients).to.deep.include(client);
  });

  it("should get a client by id", () => {
    const client = clientService.getClientById(1);
    expect(client).to.have.property("id", 1);
  });

  it("should get a client by name", () => {
    const client = clientService.getClientsByName("John Doe Doe");
    // client is an array of clients
    expect(client[0]).to.have.property("name", "John Doe Doe");
  });

  it("should get a client by contact", () => {
    const client = clientService.getClientsByContact("1234567890");
    // client is an array of clients
    expect(client[0]).to.have.property("contact", "1234567890");
  });

  it("should get a client by address", () => {
    const client = clientService.getClientsByAddress("123 Street");
    // client is an array of clients
    expect(client[0]).to.have.property("address", "123 Street");
  });

  it("should throw an error when getting a client by id that does not exist", () => {
    expect(() => clientService.getClientById(99)).to.throw("client not found");
  });

  it("should throw an error when adding an existing client", async () => {
    const client: IClient = {
      id: 1,
      name: "John Doe Doe",
      contact: "1234567890",
      address: "123 Street",
    };

    try {
      await clientService.addClient(client);
    } catch (err) {
      if (err instanceof Error) {
        expect(err.message).to.equal("client already exists");
      }
    }
  });

  it("should throw an error when adding a client with an existing id", async () => {
    const client: IClient = {
      id: 1,
      name: "Doe John",
      contact: "0987654321",
      address: "321 Street",
    };
    try {
      await clientService.addClient(client);
    } catch (err) {
      if (err instanceof Error) {
        expect(err.message).to.equal("client id already exists");
      }
    }
  });

  it("should remove a client from the collection", async () => {
    const collection = await clientService.getCollection();
    const length = collection.length;
    await clientService.removeClient(1);
    const newCollection = await clientService.getCollection();
    expect(newCollection.length).to.equal(length - 1);
  });

  it("should remove the database file", async () => {
    await clientService.removeDatabase();
    const collection = await clientService.getCollection();
    expect(collection.length).to.equal(0);
  });
});
