"use client";
import { HeaderPage } from "@/views/headerPage";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/views/loginPage";
import { postLoginThunk } from "@/communication/loginCommunication";
import type { AppDispatch, RootState } from "@/lib/store";

export function HeaderPagePresenter({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useSelector((state: RootState) => state.user);
  return (
    <HeaderPage name={user?.first_name} loading={loading}>
      {children}
    </HeaderPage>
  );
}
