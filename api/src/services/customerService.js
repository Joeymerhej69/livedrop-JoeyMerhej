import Customer from "../models/Customer.js";

/**
 * Find a customer by email
 * @param {string} email
 * @returns {Promise<Customer|null>}
 */
export async function findCustomerByEmail(email) {
  if (!email) throw new Error("Email is required");
  return await Customer.findOne({ email });
}

/**
 * Find a customer by ID
 * @param {string} id
 * @returns {Promise<Customer|null>}
 */
export async function findCustomerById(id) {
  if (!id) throw new Error("Customer ID is required");
  return await Customer.findById(id);
}
