import { LoginCredentials } from "@/types/auth";
import axios from "axios";

export const authEndpoints = {
  async login(body: LoginCredentials) {
    const { data } = await axios.post("/api/auth/login", body);
    return data;
  },
};
