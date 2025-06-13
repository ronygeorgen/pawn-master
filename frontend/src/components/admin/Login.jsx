"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginAdmin, clearAdminError } from "../../store/slices/adminSlice"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, loading, error } = useSelector((state) => state.admin)

  console.log(error, 'errpr');
  

  const usernameError = error?.username?.[0]
    const passwordError = error?.password?.[0]
    const generalError = formError || error?.detail
 
    console.log(isAuthenticated, 'isaauthh');
    
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/onboarding/")
    }
  }, [isAuthenticated])

  useEffect(() => {
    return () => {
      dispatch(clearAdminError())
    }
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    dispatch(clearAdminError())

    if (!username || !password) {
      setFormError("Username and password are required")
      return
    }

    dispatch(loginAdmin({ username, password }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all">
        {/* Header */}
        <div className="text-center px-8 pt-10 pb-4 bg-gradient-to-b from-gray-100 to-transparent">
          <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Admin Login</h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-10 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {generalError && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md text-sm border-l-4 border-red-500">
                    {generalError}
                </div>
            )}


            {/* Username */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                        if (error?.username) dispatch(clearAdminError())
                    }}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className={`w-full px-4 py-2 border ${
                    usernameError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 ${
                    usernameError ? 'focus:ring-red-400' : 'focus:ring-blue-400'
                    } focus:bg-white transition`}
                />
                {usernameError && <p className="text-sm text-red-600 mt-1">{usernameError}</p>}
            </div>


            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <div className="relative">
                    <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                        if (error?.password) dispatch(clearAdminError())
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full px-4 py-2 border ${
                        passwordError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 ${
                        passwordError ? 'focus:ring-red-400' : 'focus:ring-blue-400'
                    } focus:bg-white transition`}
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                    </button>
                </div>
                {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm shadow-sm transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
