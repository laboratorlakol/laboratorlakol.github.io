import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-medium uppercase tracking-wider transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-signal text-void px-6 py-3 hover:bg-signal-bright shadow-[0_0_24px_-4px_var(--glow)] hover:shadow-[0_0_36px_-2px_var(--glow)]",
        outline:
          "border border-line px-6 py-3 text-ink hover:border-signal hover:text-signal hover:bg-signal/5",
        ghost:
          "px-4 py-2 text-ink-muted hover:text-signal",
        link: "text-signal underline-offset-4 hover:underline px-0 py-0",
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
