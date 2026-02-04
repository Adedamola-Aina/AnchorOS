import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
    {
        variants: {
            variant: {
                primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-100 dark:shadow-none focus-visible:ring-primary-500',
                secondary: 'border-2 border-border-subtle dark:border-border-dark bg-surface-1 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark hover:bg-surface-2 dark:hover:bg-surface-3-dark focus-visible:ring-muted',
                ghost: 'hover:bg-surface-3 dark:hover:bg-surface-3-dark text-muted dark:text-muted-dark hover:text-foreground dark:hover:text-foreground-dark focus-visible:ring-muted',
            },
            size: {
                sm: 'h-11 md:h-9 px-3 rounded-lg',  // 44px on mobile, 36px on desktop
                md: 'h-11 px-6',
                lg: 'h-14 px-8 text-base',
                icon: 'h-11 w-11 md:h-10 md:w-10',  // 44px on mobile, 40px on desktop
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-transparent" />
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
