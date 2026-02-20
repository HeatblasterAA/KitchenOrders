import axios from "axios";

const API = "http://localhost:8080";

export async function login(username, password) {
  const res = await axios.post(`${API}/auth/login`, {
    username,
    password,
  });

  localStorage.setItem("token", res.data.token);
}
