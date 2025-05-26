import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  togglePasswordVisibility?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className = "",
      fullWidth = true,
      type = 'text',
      togglePasswordVisibility = false,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputType = togglePasswordVisibility
      ? (isPasswordVisible ? 'text' : 'password')
      : type;

    const handleTogglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const widthClass = fullWidth ? "w-full" : "";
    const inputClasses = `
      rounded-md border ${
        error
          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      }
      shadow-sm py-2 ${leftIcon ? "pl-10" : "pl-3"} ${rightIcon || togglePasswordVisibility ? "pr-10" : "pr-3"}
      block bg-white text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2
      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
      text-base
      ${widthClass} ${className}
    `;

    const RighIconComponent = () => {
      if (togglePasswordVisibility) {
        return isPasswordVisible ? (
          <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={handleTogglePasswordVisibility} />
        ) : (
          <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={handleTogglePasswordVisibility} />
        );
      }
      return rightIcon ? <>{rightIcon}</> : null;
    };

    return (
      <div className={widthClass}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input ref={ref} type={inputType} className={inputClasses} {...props} />
          {(rightIcon || togglePasswordVisibility) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              <RighIconComponent />
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;