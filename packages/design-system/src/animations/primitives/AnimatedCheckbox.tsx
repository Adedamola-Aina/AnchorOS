/**
 * AnimatedCheckbox - Checkbox with check mark draw animation
 * WEB-003: Phase 5 micro-interaction
 * 
 * Usage:
 *   <AnimatedCheckbox checked={isChecked} onChange={setIsChecked} />
 */

import { motion, AnimatePresence } from 'framer-motion';
import { springBouncy, springSnappy } from '../transitions';
import { useReducedMotion } from '../hooks';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
    /** Checked state */
    checked: boolean;
    /** Change handler */
    onChange: (checked: boolean) => void;
    /** Label text */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional className */
    className?: string;
    /** ID for form association */
    id?: string;
}

const sizeMap = {
    sm: { box: 'w-4 h-4', icon: 'w-3 h-3', text: 'text-sm' },
    md: { box: 'w-5 h-5', icon: 'w-3.5 h-3.5', text: 'text-sm' },
    lg: { box: 'w-6 h-6', icon: 'w-4 h-4', text: 'text-base' },
} as const;

export function AnimatedCheckbox({
    checked,
    onChange,
    label,
    disabled = false,
    size = 'md',
    className = '',
    id,
}: AnimatedCheckboxProps) {
    const prefersReducedMotion = useReducedMotion();
    const sizes = sizeMap[size];
    // eslint-disable-next-line react-hooks/purity
    const checkboxId = React.useMemo(() => id || `checkbox-${Math.random().toString(36).slice(2)}`, [id]);

    return (
        <label
            htmlFor={checkboxId}
            className={`flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <motion.div
                className={`
                    ${sizes.box} rounded flex items-center justify-center
                    border-2 transition-colors
                    ${checked
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-surface-2 dark:bg-surface-3-dark border-border dark:border-border-subtle'}
                `}
                whileHover={!disabled && !prefersReducedMotion ? { scale: 1.1 } : undefined}
                whileTap={!disabled && !prefersReducedMotion ? { scale: 0.9 } : undefined}
                transition={springSnappy}
            >
                <input
                    type="checkbox"
                    id={checkboxId}
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <AnimatePresence>
                    {checked && (
                        <motion.div
                            initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={springBouncy}
                        >
                            <Check className={`${sizes.icon} text-white`} strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            {label && (
                <span className={`${sizes.text} text-foreground dark:text-foreground-dark`}>
                    {label}
                </span>
            )}
        </label>
    );
}

// ============================================================
// PATH-DRAW VARIANT (SVG checkmark animation)
// ============================================================

interface AnimatedCheckboxPathProps extends Omit<AnimatedCheckboxProps, 'size'> {
    /** Size in pixels */
    size?: number;
}

export function AnimatedCheckboxPath({
    checked,
    onChange,
    label,
    disabled = false,
    size = 20,
    className = '',
    id,
}: AnimatedCheckboxPathProps) {
    const prefersReducedMotion = useReducedMotion();
    // eslint-disable-next-line react-hooks/purity
    const checkboxId = React.useMemo(() => id || `checkbox-path-${Math.random().toString(36).slice(2)}`, [id]);

    // SVG path for checkmark (draw animation)
    const checkPath = "M3 12l5 5L18 6";

    return (
        <label
            htmlFor={checkboxId}
            className={`flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <motion.div
                className={`
                    rounded flex items-center justify-center border-2 transition-colors
                    ${checked
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-surface-2 dark:bg-surface-3-dark border-border dark:border-border-subtle'}
                `}
                style={{ width: size, height: size }}
                whileHover={!disabled && !prefersReducedMotion ? { scale: 1.1 } : undefined}
                whileTap={!disabled && !prefersReducedMotion ? { scale: 0.9 } : undefined}
                transition={springSnappy}
            >
                <input
                    type="checkbox"
                    id={checkboxId}
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-3/4 h-3/4"
                >
                    <motion.path
                        d={checkPath}
                        stroke="white"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: checked ? 1 : 0 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                    />
                </svg>
            </motion.div>
            {label && (
                <span className="text-sm text-foreground dark:text-foreground-dark">
                    {label}
                </span>
            )}
        </label>
    );
}

export default AnimatedCheckbox;
