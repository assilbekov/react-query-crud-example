import { UserWithToken } from "../../models";
import type { LoginRequest } from "./types";

export const login = async (request: LoginRequest): Promise<UserWithToken> => {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return await response.json()
}