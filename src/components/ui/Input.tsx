import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    isErrorState?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, isErrorState, id, ...props }, ref) => {
        const defaultId = React.useId();
        const inputId = id || defaultId;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-xs font-bold text-zinc-900 uppercase tracking-wide block"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        "w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-4 py-3 text-base shadow-brutal-sm transition-all outline-none",
                        "focus:shadow-[6px_6px_0px_0px_rgba(173,255,0,1)] focus:-translate-y-[2px] focus:-translate-x-[2px] focus:border-zinc-900",
                        "placeholder:text-zinc-400 font-medium",
                        "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-50",
                        (isErrorState || error) && "border-red-500 focus:shadow-[6px_6px_0px_0px_rgba(239,68,68,1)]",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <span className="text-xs font-bold text-red-500 block">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
