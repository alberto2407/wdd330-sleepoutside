const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const response = await res.json();
  if (res.ok) {
    return response;
  } else {
    //throw new Error("Bad Response");
    throw { name: "servicesError", message: response };
  }
}

export default class ExternalServices {
  constructor() {}
  async getData(category) {
    const response = await fetch(`${baseURL}/products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}/product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(`${baseURL}/checkout/`, options);
      const data = await convertToJson(response);
      return data;
    } catch (error) {
      throw new Error("Error en el servidor: " + error.message);
    }
  }
}



/* const baseURL = `${window.location.protocol}//${window.location.host}`;

async function convertToJson(res) {
  const response = await res.json();
  if (res.ok) {
    return response;
  } else {
    //throw new Error("Bad Response");
    throw { name: "servicesError", message: response };
  }
}

export default class ExternalServices {
  constructor() {}
  async getData(category) {
    const response = await fetch(`${baseURL}/json/${category}.json`);
    const data = await convertToJson(response);
    return data?.Result || data;
  }
  async findProductById(id) {
  const categories = ["tents", "sleeping-bags", "backpacks"];
  
  // Search through each category file
  for (const category of categories) {
    try {
      const response = await fetch(`../json/${category}.json`);
      if (!response.ok) continue; // Skip if file doesn't exist
      
      const products = await response.json();
      const product = products?.Result.find(item => item.Id === id);
      
      if (product) return product;
    } catch (error) {
      console.error(`Error searching in ${category}.json:`, error);
    }
  }
  
  throw new Error("Product not found: " + id);
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(`${baseURL}/checkout/`, options);
      const data = await convertToJson(response);
      return data;
    } catch (error) {
      throw new Error("Error en el servidor: " + error.message);
    }
  }
}
 */