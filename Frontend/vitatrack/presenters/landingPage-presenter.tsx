"use client";

import { LandingPage } from "@/views/landingPage";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export function LandingPagePresenter() {
  const { is_authenticated, user, loading } = useSelector(
    (state: RootState) => state.user,
  );
  if (loading) {
    return null;
  }
  return (
    <LandingPage
      is_authenticated={is_authenticated}
      user={user}
      loading={loading}
    />
  );
}
