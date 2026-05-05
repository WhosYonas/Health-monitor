"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { PatientLoginPage } from "@/views/patientLogin";
import { postPatientLoginThunk } from "@/communication/patientLoginCommunication";
import type { AppDispatch, RootState } from "@/lib/store";

export function PatientLoginPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, login_error_message } = useSelector(
    (state: RootState) => state.user,
  );

  async function handleLogin(credentials: {
    personNumber: string;
    password: string;
  }) {
    try {
      await dispatch(
        postPatientLoginThunk({
          identifier: credentials.personNumber,
          password: credentials.password,
        }),
      ).unwrap();
      router.push("/overview");
    } catch (error) {
      console.log("Login failed", error);
    }
  }

  return (
    <PatientLoginPage
      onLogin={handleLogin}
      loading={loading}
      login_error_message={login_error_message}
    />
  );
}
