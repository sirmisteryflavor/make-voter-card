import React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:pointer-events-none disabled:opacity-50 border-2 border-zinc-900 shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100",
    {
        variants: {
            variant: {
                primary: "bg-sprout hover:bg-sprout-hover text-zinc-900",
                secondary: "bg-hyper hover:bg-hyper-hover text-white",
                outline: "bg-zinc-50 hover:bg-zinc-100 text-zinc-900",
                ghost: "border-transparent shadow-none hover:bg-zinc-100 text-zinc-900 active:translate-x-0 active:translate-y-0",
            },
            size: {
                default: "h-12 px-6 py-2",
                sm: "h-9 px-4 text-sm rounded-lg shadow-brutal-sm",
                lg: "h-14 px-8 text-lg rounded-2xl shadow-brutal-lg",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        isLoading?: boolean;
    };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={disabled || isLoading}
                whileTap={{ scale: 0.98 }}
                {...(props as any)}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children as React.ReactNode}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
