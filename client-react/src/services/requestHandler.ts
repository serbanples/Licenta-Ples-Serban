import { DATASOURCE_URL } from "../config/config";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const POST = async (route: string, body: any) => {
  const url = DATASOURCE_URL + route;
  return fetch(url, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(body),
  }).then((response) => {
    return response.json()
      .then((res) => {
        if(!response.ok) {
          throw new Error(res.message);
        }
        return res;
      })
  })
};

export const GET = async (route: string) => {
  const url = DATASOURCE_URL + route;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`GET request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

export const PUT = async (route: string, body: any) => {
  const url = DATASOURCE_URL + route;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PUT request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in PUT request:", error);
    throw error;
  }
};

export const DELETE = async (route: string) => {
  const url = DATASOURCE_URL + route;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};