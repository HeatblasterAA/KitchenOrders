// const BASE_URL = "http://localhost:8080";

// export async function authFetch(path, options = {}) {
//   const token = localStorage.getItem("token");

//   const res = await fetch(`${BASE_URL}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...(options.headers || {}),
//     },
//   });

//   if (res.status === 401 || res.status === 403) {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//     throw new Error("Unauthorized");
//   }

//   return res;
// }

const BASE_URL = "http://localhost:8080";

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();

  localStorage.setItem("token", data.token);

  return data;
}
