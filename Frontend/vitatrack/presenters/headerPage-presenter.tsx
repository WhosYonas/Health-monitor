"use client";
import { HeaderPage } from "@/views/headerPage";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/views/loginPage";
import { postLogoutThunk } from "@/communication/logoutCommunication";
import type { AppDispatch, RootState } from "@/lib/store";
import UserSync from "@/utils/userSync";
import { logout } from "@/models/redux/userSlice";
import { toast } from "sonner";

export function HeaderPagePresenter({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  async function handleLogout() {
    try {
      await dispatch(postLogoutThunk()).unwrap();
      dispatch(logout());
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Logout failed", error);
    }
  }

  const { loading, user } = useSelector((state: RootState) => state.user);
  return (
    <HeaderPage
      name={user?.first_name}
      loading={loading}
      onLogout={handleLogout}
    >
      {children}
    </HeaderPage>
  );
}
