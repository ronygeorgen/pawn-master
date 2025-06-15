import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AdminProtected({children}) {
    const isAuthenticated = useSelector(state=>state.admin.isAuthenticated)

    console.log(isAuthenticated, 'from adminprotected');
    

    if (!isAuthenticated){
        return <Navigate to="/admin/login" replace />;
    }
  return children
}

export default AdminProtected
