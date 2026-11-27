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
  changePassword: (data) => request("POST", "/api/auth/password", data),
  family: () => request("GET", "/api/family"),
  createChild: (data) => request("POST", "/api/family/children", data),
  linkCode: () => request("POST", "/api/family/link-code", {}),
  linkChild: (code) => request("POST", "/api/family/link", { code }),
  resetChildPassword: (id, password) =>
    request("POST", `/api/family/children/${encodeURIComponent(id)}/password`, { password }),
  removeChild: (id) => request("DELETE", `/api/family/children/${encodeURIComponent(id)}`),
  rewards: () => request("GET", "/api/rewards"),
  addReward: (data) => request("POST", "/api/rewards", data),
  removeReward: (id) => request("DELETE", `/api/rewards/${encodeURIComponent(id)}`),
  claimReward: (id) => request("POST", `/api/rewards/${encodeURIComponent(id)}/claim`, {}),
  decideClaim: (id, approve) => request("POST", `/api/claims/${encodeURIComponent(id)}`, { approve }),
  pushKey: () => request("GET", "/api/push/key"),
  savePush: (data) => request("PUT", "/api/push", data),
  deletePush: (endpoint) => request("DELETE", "/api/push", { endpoint }),
  telegramStatus: () => request("GET", "/api/telegram"),
  telegramLink: (data) => request("POST", "/api/telegram/link", data),
  updateTelegram: (data) => request("PUT", "/api/telegram", data),
  unlinkTelegram: () => request("DELETE", "/api/telegram"),
  reviewWork: (data) => request("POST", "/api/work/review", data),
  reflect: (data) => request("POST", "/api/coach/reflection", data),
  encourage: (data) => request("POST", "/api/coach/encouragement", data),
  catalog: () => request("GET", "/api/catalog"),
  publishCatalog: (catalog) => request("PUT", "/api/catalog", { catalog }),
  submitInquiry: (data) => request("POST", "/api/inquiries", data),
  inquiries: () => request("GET", "/api/inquiries"),
  classes: () => request("GET", "/api/classes"),
  createClass: (data) => request("POST", "/api/classes", data),
  classDetail: (id) => request("GET", `/api/classes/${encodeURIComponent(id)}`),
  updateClass: (id, data) => request("PUT", `/api/classes/${encodeURIComponent(id)}`, data),
  rotateClassCode: (id) => request("POST", `/api/classes/${encodeURIComponent(id)}/rotate-code`, {}),
  deleteClass: (id) => request("DELETE", `/api/classes/${encodeURIComponent(id)}`),
  addRoster: (id, data) => request("POST", `/api/classes/${encodeURIComponent(id)}/roster`, data),
  resetClassStudentPassword: (classId, studentId, password) =>
    request(
      "POST",
      `/api/classes/${encodeURIComponent(classId)}/students/${encodeURIComponent(studentId)}/password`,
      password ? { password } : {},
    ),
  removeClassStudent: (classId, studentId) =>
    request(
      "DELETE",
      `/api/classes/${encodeURIComponent(classId)}/students/${encodeURIComponent(studentId)}`,
    ),
  joinClass: (code) => request("POST", "/api/classes/join", { code }),
  leaveClass: (id) => request("DELETE", `/api/classes/${encodeURIComponent(id)}/leave`),
};
