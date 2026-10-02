import { useState, type ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFieldContext } from "./context"
import { firstErrorMessage } from "./error"

const inputClass =
    "w-full rounded-[1rem] bg-surface-container-lowest py-2.5 text-body-sm text-on-surface shadow-inner transition-colors placeholder:text-outline-variant focus:bg-surface-container-low focus:outline-none aria-invalid:ring-1 aria-invalid:ring-error/60"

interface FieldControlProps {
    id: string
    name: string
    type: string
    value: string
    placeholder?: string
    autoComplete?: string
    required?: boolean
    leading?: ReactNode
    trailing?: ReactNode
    invalid: boolean
    describedBy?: string
    inputClassName?: string
    onValueChange: (value: string) => void
    onBlur: () => void
}

function FieldControl({
    id,
    name,
    type,
    value,
    placeholder,
    autoComplete,
    required,
    leading,
    trailing,
    invalid,
    describedBy,
    inputClassName,
    onValueChange,
    onBlur,
}: FieldControlProps) {
    return (
        <div className="relative flex items-center">
            {leading && (
                <span className="pointer-events-none absolute left-3 flex text-outline">{leading}</span>
            )}
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => onValueChange(event.target.value)}
                onBlur={onBlur}
                className={cn(
                    inputClass,
                    leading ? "pl-10" : "pl-space-md",
                    trailing ? "pr-10" : "pr-space-md",
                    inputClassName,
                )}
            />
            {trailing && <span className="absolute right-3 flex items-center">{trailing}</span>}
        </div>
    )
}

interface ControlFieldProps {
    type?: "text" | "email"
    placeholder?: string
    autoComplete?: string
    required?: boolean
    icon?: ReactNode
    inputClassName?: string
}

export function TextField({ type = "text", placeholder, autoComplete, required, icon, inputClassName }: ControlFieldProps) {
    const field = useFieldContext<string>()
    const message = firstErrorMessage(field.state.meta.errors)

    return (
        <div className="flex flex-col gap-space-xs">
            <FieldControl
                id={field.name}
                name={field.name}
                type={type}
                value={field.state.value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                leading={icon}
                invalid={Boolean(message)}
                describedBy={message ? `${field.name}-error` : undefined}
                inputClassName={inputClassName}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
            />
            {message && (
                <p id={`${field.name}-error`} role="alert" className="font-display text-label-sm text-error">
                    {message}
                </p>
            )}
        </div>
    )
}

export function PasswordField({ placeholder, autoComplete, required, icon, inputClassName }: Omit<ControlFieldProps, "type">) {
    const field = useFieldContext<string>()
    const [visible, setVisible] = useState(false)
    const message = firstErrorMessage(field.state.meta.errors)

    return (
        <div className="flex flex-col gap-space-xs">
            <FieldControl
                id={field.name}
                name={field.name}
                type={visible ? "text" : "password"}
                value={field.state.value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                leading={icon}
                trailing={
                    <button
                        type="button"
                        title="Toggle token visibility"
                        onClick={() => setVisible((value) => !value)}
                        className="flex items-center justify-center rounded-full p-1 text-outline transition-colors hover:text-on-surface"
                    >
                        {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                    </button>
                }
                invalid={Boolean(message)}
                describedBy={message ? `${field.name}-error` : undefined}
                inputClassName={cn("tracking-widest", inputClassName)}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
            />
            {message && (
                <p id={`${field.name}-error`} role="alert" className="font-display text-label-sm text-error">
                    {message}
                </p>
            )}
        </div>
    )
}
