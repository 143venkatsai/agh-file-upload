export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiRequest = async (
  path,
  { method = "GET", query, body } = {},
) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const options = { method, headers: {} };
  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  return data;
};

// Files API
export const uploadFileApi = (formData) =>
  apiRequest("/files/upload", { method: "POST", body: formData });
export const finalizeFileApi = (payload) =>
  apiRequest("/files/finalize", { method: "PUT", body: payload });
export const getFilesApi = () => apiRequest("/files/get-pdf");
export const getFileByIdApi = (id) => apiRequest(`/files/get-pdf/${id}`);
export const deleteFileApi = (id) =>
  apiRequest(`/files/${id}`, { method: "DELETE" });

// Students API
export const getFileAccessStudentsApi = ({
  fileId,
  search,
  page = 1,
  limit = 10,
}) =>
  apiRequest(`/files/students/access/${fileId}`, {
    query: { search, page, limit },
  });
export const getAllStudentsForFileApi = ({
  fileId,
  search,
  page = 1,
  limit = 10,
}) =>
  apiRequest(`/files/${fileId}/students`, { query: { search, page, limit } });
export const updateFileStudentsAccessApi = ({ fileId, studentIds }) =>
  apiRequest(`/files/students/access/${fileId}`, {
    method: "POST",
    body: { studentIds },
  });

export const removeStudentAccessApi = ({ fileId, studentId }) =>
  apiRequest(`/files/${fileId}/remove-access`, {
    method: "PATCH",
    body: { studentId },
  });
