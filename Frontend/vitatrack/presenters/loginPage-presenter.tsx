"use client";

import { useDispatch, useSelector } from "react-redux";
import { LoginPage } from "@/views/loginPage";
import { postLoginThunk } from "@/communication/loginCommunication";
import type { AppDispatch, RootState } from "@/lib/store";

export function LoginPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error_message } = useSelector(
    (state: RootState) => state.user,
  );

  async function handleLogin(credentials: {
    personNumber: string;
    password: string;
    role: "caregiver" | "patient";
  }) {
    try {
      await dispatch(
        postLoginThunk({
          personnummer: credentials.personNumber,
          password: credentials.password,
          role: credentials.role,
        }),
      ).unwrap();
      console.log("Login successful");
    } catch (error) {
      console.log("Login failed", error);
    }
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      loading={loading}
      errorMessage={error_message}
    />
  );
}
