import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "outline"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90": variant === "default",
                        "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
                        "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900": variant === "outline",
                        "h-9 px-4 py-2": size === "default",
                        "h-7 rounded-md px-3": size === "sm",
                        "h-10 rounded-md px-8": size === "lg",
                        "h-9 w-9": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button } 