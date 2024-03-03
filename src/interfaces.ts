/**
 * Interface to represent the data structure of a furniture
 */
export interface Furniture {
  id: number;
  name: string;
  description: string;
  material: string;
  dimensions: string;
  price: number;
}

/**
 * Interface to represent the data structure of a provider
 */
export interface Provider {
  id: number;
  name: string;
  contact: string;
  address: string;
}

/**
 * Interface to represent the data structure of a client
 */
export interface Client {
  id: number;
  name: string;
  contact: string;
  address: string;
}