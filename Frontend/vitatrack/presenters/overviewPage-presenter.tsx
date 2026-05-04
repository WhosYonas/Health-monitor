"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { OverviewPage } from "../views/overviewPage";
import { AppDispatch, RootState } from "@/lib/store";
//import { postGetOverviewThunk } from "@/communication/overviewCommunication";


export function OverviewPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();

  const patients = useSelector((state: RootState) => state.patientManagement.patients);

  //const notifications = useSelector((state: RootState) => state.user.user.);


  
  //useEffect(() => {dispatch(postGetOverviewThunk());}, [dispatch]);
  

  return (
    <OverviewPage
      
    />
  );
}

/**
 patients={overview}
      notifications={overview.notifications}
      tasks={overview.tasks}
      stats={overview.stats}
      selectedPatientID={overview.selectedPatientID}
      sortMode={overview.sortMode}
      loading={overview.loading}
      errorMessage={overview.error}
      role={role}
 */