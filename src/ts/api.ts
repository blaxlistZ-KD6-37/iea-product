import "../css/style.css";

const new_header: Headers = new Headers();

const requestOptions = (
  method_type: string,
  header_type: HeadersInit,
  data_obj: Record<string, any> | null = null
): RequestInit => {
  let path: RequestInit = {
    method: method_type,
    headers: header_type,
    redirect: "follow",
  };
  if (data_obj !== null) {
    path = {
      method: method_type,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_obj),
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

export const PostDB = async <T>(path: string, obj: T): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8080/A1_/runlive/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.log("Error in posting the database", error);
    throw error;
  }
};

export default {
  GetDB,
  PostDB,
};
