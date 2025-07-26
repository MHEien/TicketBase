import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const getButtonStyles = () => {
    // Default button style - can be overridden by server-side branding CSS
    return "rounded-md";
  };

  const getVariantStyles = () => {
    // Use CSS variables for colors - set by server-side branding
    switch (variant) {
      case "primary":
        return {
          className:
            "text-white shadow-sm hover:opacity-90 focus:ring-2 focus:ring-offset-2",
          style: {
            backgroundColor: "var(--primary-color, #3b82f6)",
            borderColor: "var(--primary-color, #3b82f6)",
            "--tw-ring-color": "var(--primary-color, #3b82f6)",
          },
        };
      case "secondary":
        return {
          className:
            "text-white shadow-sm hover:opacity-90 focus:ring-2 focus:ring-offset-2",
          style: {
            backgroundColor: "var(--secondary-color, #64748b)",
            borderColor: "var(--secondary-color, #64748b)",
            "--tw-ring-color": "var(--secondary-color, #64748b)",
          },
        };
      case "outline":
        return {
          className:
            "bg-white border-2 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2",
          style: {
            borderColor: "var(--primary-color, #3b82f6)",
            color: "var(--primary-color, #3b82f6)",
            "--tw-ring-color": "var(--primary-color, #3b82f6)",
          },
        };
      case "ghost":
        return {
          className: "hover:bg-gray-100 focus:ring-2 focus:ring-offset-2",
          style: {
            color: "var(--primary-color, #3b82f6)",
            "--tw-ring-color": "var(--primary-color, #3b82f6)",
          },
        };
      default:
        return {
          className:
            "text-white shadow-sm hover:opacity-90 focus:ring-2 focus:ring-offset-2",
          style: {
            backgroundColor: "var(--primary-color, #3b82f6)",
            borderColor: "var(--primary-color, #3b82f6)",
            "--tw-ring-color": "var(--primary-color, #3b82f6)",
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const buttonStyles = getButtonStyles();

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        buttonStyles,
        variantStyles.className,
        className,
      )}
      style={variantStyles.style}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
