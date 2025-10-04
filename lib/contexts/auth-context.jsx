"use client"

import { createContext, useContext, useReducer } from "react"

const AuthContext = createContext(undefined)

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true }
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false }
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  })

  const login = (user) => {
    dispatch({ type: "LOGIN", payload: user })
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const updateUser = (updates) => {
    dispatch({ type: "UPDATE_USER", payload: updates })
  }

  return <AuthContext.Provider value={{ state, dispatch, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
