const new_header: Headers = new Headers();

const requestOptions = (
  method_type: string,
  header_type: HeadersInit,
  data_obj = null
): RequestInit => {
  let path: RequestInit = {
    method: method_type,
    headers: header_type,
    redirect: "follow",
  };
  if (data_obj !== null) {
    path = {
      method: method_type,
      headers: header_type,
      body: JSON.stringify(data_obj),
      redirect: "follow",
    };
  }

  return path;
};

export const GetDB = async <T>(path: string): Promise<T> => {
  try {
    const response = await fetch(
      `http://localhost:8080/A1_/runlive/${path}`,
      requestOptions("GET", new_header)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();

    return data;
  } catch (error) {
    console.error("Error in getting the database:", error);
    throw error;
  }
};

export default {
  GetDB,
};
