import axios from "axios";

const API = "https://kitchenorders-production.up.railway.app";

export async function login(username, password) {
  const res = await axios.post(`${API}/auth/login`, {
    username,
    password,
  });

  localStorage.setItem("token", res.data.token);
}
