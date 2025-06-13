import { apiService } from "./api";

export const adminService = {
  login: async (credentials) => {
    const res = apiService.post('/core/login/', credentials)

    return await res // expected to return { admin, token }
  },
};
