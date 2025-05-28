// import { Navigate, Outlet, useLocation } from 'react-router-dom'
// import { useEffect, useState } from 'react'

// const ProtectedRoute = () => {
//   const [isAuthorized, setIsAuthorized] = useState(null)
//   const location = useLocation()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
    
//     // Simple token existence check; replace with validation logic if needed
//     if (token) {
//       setIsAuthorized(true)
//     } else {
//       setIsAuthorized(false)
//     }
//   }, [])

//   if (isAuthorized === null) {
//     // Optional loading UI
//     return <div className="min-h-screen flex items-center justify-center">Checking access...</div>
//   }

//   return isAuthorized ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/" replace state={{ from: location }} />
//   )
// }

// export default ProtectedRoute
