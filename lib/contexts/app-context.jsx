"use client"

import { createContext, useContext, useReducer } from "react"

const initialCards = [
  {
    id: "card1",
    bankName: "HDFC Bank",
    cardNumber: "4532********1234",
    cardholderName: "JOHN DOE",
    expiryDate: "12/27",
    cvv: "***",
    creditLimit: 100000,
    outstanding: 12450,
    available: 87550,
    status: "active",
    color: "from-orange-500 to-red-500",
    lastUsed: "2024-10-03",
  },
  {
    id: "card2",
    bankName: "ICICI Bank",
    cardNumber: "5412********5678",
    cardholderName: "JOHN DOE",
    expiryDate: "08/26",
    cvv: "***",
    creditLimit: 75000,
    outstanding: 18200,
    available: 56800,
    status: "active",
    color: "from-red-600 to-pink-600",
    lastUsed: "2024-10-02",
  },
  {
    id: "card3",
    bankName: "SBI Card",
    cardNumber: "6011********9012",
    cardholderName: "JOHN DOE",
    expiryDate: "03/28",
    cvv: "***",
    creditLimit: 50000,
    outstanding: 14630,
    available: 35370,
    status: "frozen",
    color: "from-blue-600 to-cyan-500",
    lastUsed: "2024-09-28",
  },
]

const initialTransactions = [
  {
    id: "txn1",
    cardId: "card1",
    merchant: "Amazon India",
    amount: 2450,
    category: "Shopping",
    date: "2024-10-03T14:30:00",
    status: "completed",
    icon: "ShoppingBag",
  },
  {
    id: "txn2",
    cardId: "card1",
    merchant: "Swiggy",
    amount: 680,
    category: "Food & Dining",
    date: "2024-10-02T20:15:00",
    status: "completed",
    icon: "Utensils",
  },
  {
    id: "txn3",
    cardId: "card2",
    merchant: "MakeMyTrip",
    amount: 8900,
    category: "Travel",
    date: "2024-10-01T09:45:00",
    status: "completed",
    icon: "Plane",
  },
  {
    id: "txn4",
    cardId: "card3",
    merchant: "Electricity Bill",
    amount: 2100,
    category: "Utilities",
    date: "2024-09-30T11:00:00",
    status: "completed",
    icon: "Zap",
  },
  {
    id: "txn5",
    cardId: "card2",
    merchant: "Myntra",
    amount: 3400,
    category: "Shopping",
    date: "2024-09-29T16:20:00",
    status: "completed",
    icon: "ShoppingBag",
  },
]

const initialSplitBills = [
  {
    id: "split1",
    title: "Dinner at Taj",
    amount: 8500,
    date: "2024-10-02T19:30:00",
    splitType: "equal",
    participants: [
      { name: "You", amount: 2125 },
      { name: "Rahul", amount: 2125 },
      { name: "Priya", amount: 2125 },
      { name: "Amit", amount: 2125 },
    ],
  },
  {
    id: "split2",
    title: "Movie Night",
    amount: 1200,
    date: "2024-09-29T20:00:00",
    splitType: "equal",
    participants: [
      { name: "You", amount: 400 },
      { name: "Sarah", amount: 400 },
      { name: "Mike", amount: 400 },
    ],
  },
]

const AppContext = createContext(undefined)

const appReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CARD":
      return { ...state, cards: [...state.cards, action.payload] }
    case "REMOVE_CARD":
      return {
        ...state,
        cards: state.cards.filter((c) => c.id !== action.payload),
      }
    case "FREEZE_CARD":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.payload ? { ...c, status: c.status === "active" ? "frozen" : "active" } : c,
        ),
      }
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    case "MAKE_PAYMENT":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.payload.cardId
            ? {
                ...c,
                outstanding: Math.max(0, c.outstanding - action.payload.amount),
                available: Math.min(c.creditLimit, c.available + action.payload.amount),
              }
            : c,
        ),
      }
    case "ADD_SPLIT_BILL":
      return {
        ...state,
        splitBills: [action.payload, ...state.splitBills],
      }
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === "dark" ? "light" : "dark",
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    cards: initialCards,
    transactions: initialTransactions,
    splitBills: initialSplitBills,
    theme: "dark",
  })

  const addCard = (card) => {
    dispatch({ type: "ADD_CARD", payload: card })
  }

  const removeCard = (cardId) => {
    dispatch({ type: "REMOVE_CARD", payload: cardId })
  }

  const freezeCard = (cardId) => {
    dispatch({ type: "FREEZE_CARD", payload: cardId })
  }

  const makePayment = (cardId, amount) => {
    dispatch({ type: "MAKE_PAYMENT", payload: { cardId, amount } })
  }

  const addTransaction = (transaction) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction })
  }

  const addSplitBill = (splitBill) => {
    dispatch({ type: "ADD_SPLIT_BILL", payload: splitBill })
  }

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" })
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addCard,
        removeCard,
        freezeCard,
        makePayment,
        addTransaction,
        addSplitBill,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
