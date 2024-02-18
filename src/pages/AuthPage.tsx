import { useState } from "react"
import { LoginRequest } from "../api/auth/types";
import { useAuthContext } from "../state/AuthContext";


export const AuthPage: React.FC = () => {
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    username: "kminchelle",
    password: "0lelplR",
  });
  const { loginMutation } = useAuthContext();

  if (!loginMutation) return null;

  return (
    <div>
      <h2>Auth Page</h2>
      {loginMutation.isError && <div>Error: {loginMutation.error.message}</div>}
      {loginMutation.isPending && <div>Loading...</div>}
      {loginMutation.isSuccess && <div>Logged in!</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginMutation.mutate(loginForm);
        }}
      >
        <input
          type="text"
          value={loginForm.username}
          onChange={(e) => {
            setLoginForm({
              ...loginForm,
              username: e.target.value,
            });
          }}
        />
        <input
          type="password"
          value={loginForm.password}
          onChange={(e) => {
            setLoginForm({
              ...loginForm,
              password: e.target.value,
            });
          }}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}