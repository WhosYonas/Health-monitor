"use client";

import {DetailedPage} from '../views/detailedPage';
import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {AppDispatch, RootState} from '@/lib/store';


export function DetailedPagePresenter(){
    const dispatch = useDispatch<AppDispatch>();
    const healthData = useSelector((state: RootState) => state.user.health_data);
    const { loading, error_message } = useSelector((state: RootState) => state.user,);
    return (
        <DetailedPage 
            healthData={healthData}
            loading={loading}
            errorMessage={error_message}
        />
    )
}