const baseURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5173";

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
