import { expect } from "chai";
import {ClientService} from "../../src/database/ClientsService.js";
import {IClient} from "../../src/interfaces/IClient.js";

describe("Client Service Tests", () => {
  const clientService = ClientService.getInstance();

  it("should create a new client", async () => {
    const client: IClient = {
      id: 1,
      name: "John Doe",
      contact: "1234567890",
      address: "123 Street"
    }
    await clientService.addClient(client);
    const clients = await clientService.getCollection();
    expect(clients).to.deep.include(client);
  });

  it("should get the collection of clients", async () => {
    const collection = await clientService.getCollection();
    expect(collection).to.be.an("array");
  });
});