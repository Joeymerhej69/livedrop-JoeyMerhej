import {
  findCustomerByEmail,
  findCustomerById,
} from "../services/customerService.js";

/**
 * Controller: Lookup customer by email
 */
export async function getCustomerByEmail(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }

    const customer = await findCustomerByEmail(email);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.error("Error in getCustomerByEmail:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Controller: Get customer profile by ID
 */
export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const customer = await findCustomerById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
