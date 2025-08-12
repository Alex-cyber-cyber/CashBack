// src/services/auth.service.ts
interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string }> {
    // Implementación real de llamada a API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ token: 'fake-jwt-token' });
      }, 1000);
    });
  },
};