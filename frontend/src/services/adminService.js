import { apiService } from "./api";

export const adminService = {
  login: async (credentials) => {
    const res = apiService.post('/core/login/', credentials)

    return await res // expected to return { admin, token }
  },
};

export const onBoardService = {
  onBoard: async () => {
    const res = apiService.get('core/auth/connect/')
    console.log(res, 'onboardingggg');
    
    return await res // expected to return { admin, token }
  },
};
