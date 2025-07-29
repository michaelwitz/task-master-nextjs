"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { X, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after duration (default 5 seconds)
    setTimeout(() => {
      dismiss(id)
    }, toast.duration || 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
      case "error":
        return "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
      case "warning":
        return "border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800"
      case "info":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
    }
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 p-4 rounded-lg border shadow-lg 
              max-w-md min-w-80 animate-in slide-in-from-right-full
              ${getStyles(toast.type)}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-sm opacity-90 mt-1">
                  {toast.description}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
              onClick={() => dismiss(toast.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
