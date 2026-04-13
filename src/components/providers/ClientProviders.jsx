"use client";

import { ToastProvider } from "hooks/useToast";
import ToastContainer from "components/ui/Toast";

/**
 * Wraps the app with client-side context providers.
 * Placed in the root layout to make providers available globally.
 */
export default function ClientProviders({ children }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
