import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { login } from "./apis"
import { LoginRequest } from "./types"
import { UserWithToken } from "../../models"

export const useLoginMutation = (options: UseMutationOptions<UserWithToken, Error, LoginRequest>) => {
  return useMutation({
    mutationFn: login,
    ...options,
  });
}
