export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
async function request(method, path, body) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: body === undefined ? {} : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Sin conexión. Revisa tu internet e inténtalo de nuevo.");
  }
  let data;
  try {
    data = await res.json();
  } catch {
    // Sin backend (sitio estático) la ruta responde HTML o nada.
    throw new ApiError(0, "El servicio de cuentas no está disponible en este momento.");
  }
  if (!res.ok) throw new ApiError(res.status, data.error || "No se pudo completar la acción.");
  return data;
}
export const api = {
  register: (data) => request("POST", "/api/auth/register", data),
  login: (data) => request("POST", "/api/auth/login", data),
  logout: () => request("POST", "/api/auth/logout", {}),
  me: () => request("GET", "/api/me"),
  deleteAccount: () => request("DELETE", "/api/me"),
  getProgress: () => request("GET", "/api/progress"),
  putProgress: (state) => request("PUT", "/api/progress", { state }),
  recover: (data) => request("POST", "/api/auth/recover", data),
  family: () => request("GET", "/api/family"),
  createChild: (data) => request("POST", "/api/family/children", data),
  linkCode: () => request("POST", "/api/family/link-code", {}),
  linkChild: (code) => request("POST", "/api/family/link", { code }),
  resetChildPassword: (id, password) =>
    request("POST", `/api/family/children/${encodeURIComponent(id)}/password`, { password }),
  removeChild: (id) => request("DELETE", `/api/family/children/${encodeURIComponent(id)}`),
  catalog: () => request("GET", "/api/catalog"),
  publishCatalog: (catalog) => request("PUT", "/api/catalog", { catalog }),
};
