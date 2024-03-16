import { expect } from "chai";
// import { add } from "../src/index.js";
import { ClientService } from "../src/database/ClientsService.js";
import { IClient } from "../src/interfaces/IClient.js";

// describe("Test", () => {
//   it("should return 3", () => {
//     expect(add(1, 2)).to.equal(3);
//   });
//   it("should return 5", () => {
//     expect(add(2, 3)).to.equal(5);
//   });
// });

describe("Test", () => {
  const clientService = ClientService.getInstance();

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
});
