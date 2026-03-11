export const API_BASE_URL = "http://localhost:3000/api";

//Files API
export const uploadFileApi = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Upload failed (${response.status})`);
  }
  return response.json();
};

export const finalizeFileApi = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/files/finalize`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Finalize failed");
  return data;
};

export const getFilesApi = async ({ page }) => {
  const url = new URL(`${API_BASE_URL}/files/get-pdf`);
  url.searchParams.set("page", String(page));
  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Fetch failed");
  return data;
};

export const getFileByIdApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/files/get-pdf/${id}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Fetch by ID failed");
  return data;
};

export const deleteFileApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: "DELETE",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Delete failed");
  return data;
};

//Students API

export const getAllStudentsForFileApi = async ({
  fileId,
  search,
  page = 1,
}) => {
  const url = new URL(`${API_BASE_URL}/files/${fileId}/students`);
  if (search) url.searchParams.set("search", search);
  url.searchParams.set("page", String(page));

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Failed to fetch students");
  return data;
};

export const getFileAccessStudentsApi = async ({
  fileId,
  search,
  page = 1,
  limit = 10,
}) => {
  const url = new URL(`${API_BASE_URL}/files/students/access/${fileId}`);
  if (search) url.searchParams.set("search", search);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Failed to fetch authorized students (${response.status})`,
    );
  }

  return data;
};

export const updateFileStudentsAccessApi = async ({ fileId, studentIds }) => {
  const response = await fetch(
    `${API_BASE_URL}/files/students/access/${fileId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIds }),
    },
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Failed to add access");
  return data;
};

export const removeStudentAccessApi = async ({ fileId, studentId }) => {
  const response = await fetch(
    `${API_BASE_URL}/files/${fileId}/remove-access`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    },
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Failed to remove access");
  return data;
};
