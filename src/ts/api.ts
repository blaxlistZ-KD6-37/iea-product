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
      ...path,
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

export const PostDB = async <T extends Record<string, any[]>>(
  path: string,
  obj: keyof T,
  payload: T[keyof T]
): Promise<void> => {
  try {
    const data: T = await GetDB<T>(path);
    const updated_data = {
      [obj]: [...(data[obj] || []), ...payload],
    } as Partial<T>;

    const response = await fetch(
      `http://localhost:${process.env.PORT}/A1_/runlive/${path}`,
      requestOptions("POST", new_header, updated_data)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.log("Error in posting the database", error);
    throw error;
  }
};

export const FormSubmit = <T extends Record<string, any[]>>(
  path: string,
  data: keyof T,
  e: Event
): void => {
  e.preventDefault();

  if (!(e.currentTarget instanceof HTMLFormElement)) {
    console.error("Event target is not a form element!");
    return;
  }

  const form: HTMLFormElement = e.currentTarget;
  const form_data: FormData = new FormData(form);

  const payload: Record<string, FormDataEntryValue> = {};
  form_data.forEach((content: FormDataEntryValue, ndx: string) => {
    payload[ndx] = content;
  });

  PostDB(path, data, <T[keyof T]>[payload]);
};

export default {
  GetDB,
  PostDB,
  FormSubmit,
};
