import React from "react";
import { clsx } from "clsx";
import { useOrganization } from "../../contexts/OrganizationContext";

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
  const { branding } = useOrganization();

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const getButtonStyles = () => {
    const buttonStyle = branding?.buttonStyle || "rounded";

    const roundingStyles = {
      rounded: "rounded-md",
      square: "rounded-none",
      pill: "rounded-full",
    };

    return roundingStyles[buttonStyle];
  };

  const getVariantStyles = () => {
    const primaryColor = branding?.primaryColor || "#3b82f6";
    const secondaryColor = branding?.secondaryColor || "#64748b";

    switch (variant) {
      case "primary":
        return {
          className:
            "text-white shadow-sm hover:opacity-90 focus:ring-2 focus:ring-offset-2",
          style: {
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            "--tw-ring-color": primaryColor,
          },
        };
      case "secondary":
        return {
          className:
            "text-white shadow-sm hover:opacity-90 focus:ring-2 focus:ring-offset-2",
          style: {
            backgroundColor: secondaryColor,
            borderColor: secondaryColor,
            "--tw-ring-color": secondaryColor,
          },
        };
      case "outline":
        return {
          className:
            "bg-white border-2 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2",
          style: {
            borderColor: primaryColor,
            color: primaryColor,
            "--tw-ring-color": primaryColor,
          },
        };
      case "ghost":
        return {
          className: "hover:bg-gray-100 focus:ring-2 focus:ring-offset-2",
          style: {
            color: primaryColor,
            "--tw-ring-color": primaryColor,
          },
        };
      default:
        return {
          className:
            "text-white shadow-sm hover:opacity-90 focus:ring-2 focus:ring-offset-2",
          style: {
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            "--tw-ring-color": primaryColor,
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
