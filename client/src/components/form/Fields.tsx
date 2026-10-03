import { useState, type ReactNode } from "react"
import { Eye, EyeOff, ChevronDown, X } from "lucide-react"
import {
    Button,
    ListBox,
    ListBoxItem,
    Popover,
    Select,
    SelectValue,
} from "react-aria-components"
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

interface TextAreaFieldProps {
    placeholder?: string
    rows?: number
    inputClassName?: string
}

export function TextAreaField({ placeholder, rows = 4, inputClassName }: TextAreaFieldProps) {
    const field = useFieldContext<string>()
    const message = firstErrorMessage(field.state.meta.errors)

    return (
        <div className="flex flex-col gap-space-xs">
            <textarea
                id={field.name}
                name={field.name}
                rows={rows}
                value={field.state.value}
                placeholder={placeholder}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={Boolean(message)}
                aria-describedby={message ? `${field.name}-error` : undefined}
                className={cn(
                    "w-full resize-none rounded-[1rem] bg-surface-container-lowest p-space-md text-body-sm text-on-surface shadow-inner transition-colors placeholder:text-outline-variant focus:bg-surface-container-low focus:outline-none aria-invalid:ring-1 aria-invalid:ring-error/60",
                    inputClassName,
                )}
            />
            {message && (
                <p id={`${field.name}-error`} role="alert" className="font-display text-label-sm text-error">
                    {message}
                </p>
            )}
        </div>
    )
}

interface CheckboxFieldProps {
    label: string
    description?: string
}

export function CheckboxField({ label, description }: CheckboxFieldProps) {
    const field = useFieldContext<boolean>()

    return (
        <label className="flex cursor-pointer items-start gap-space-md">
            <input
                id={field.name}
                name={field.name}
                type="checkbox"
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
                onBlur={field.handleBlur}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-primary focus:ring-0"
            />
            <span className="flex flex-col gap-0.5">
                <span className="font-display text-label-lg text-on-surface">{label}</span>
                {description && (
                    <span className="font-display text-label-sm text-on-surface-variant">{description}</span>
                )}
            </span>
        </label>
    )
}

interface SelectFieldProps {
    options: Array<{ value: string; label: string }>
    placeholder?: string
}

export function SelectField({ options, placeholder = "Select an option" }: SelectFieldProps) {
    const field = useFieldContext<string>()
    const message = firstErrorMessage(field.state.meta.errors)

    return (
        <div className="flex flex-col gap-space-xs">
            <Select
                selectedKey={field.state.value}
                onSelectionChange={(key) => field.handleChange(String(key))}
                onBlur={field.handleBlur}
                isInvalid={Boolean(message)}
                className="w-full"
            >
                <Button className="flex w-full cursor-pointer items-center justify-between gap-space-sm rounded-[1rem] bg-surface-container-lowest px-space-md py-2.5 text-body-sm text-on-surface shadow-inner outline-none transition-colors data-hovered:bg-surface-container-low data-focused:ring-2 data-focused:ring-primary/50 aria-invalid:ring-1 aria-invalid:ring-error/60">
                    <SelectValue className="truncate data-placeholder:text-outline-variant">
                        {({ selectedText, isPlaceholder }) => (isPlaceholder ? placeholder : selectedText)}
                    </SelectValue>
                    <ChevronDown className="size-4 shrink-0 text-on-surface-variant" />
                </Button>
                <Popover
                    placement="bottom start"
                    offset={6}
                    className="z-[60] w-[var(--trigger-width)] rounded-xl border border-outline-variant/40 bg-surface-container/95 p-1 shadow-xl backdrop-blur-xl outline-none"
                >
                    <ListBox className="outline-none">
                        {options.map((option) => (
                            <ListBoxItem
                                key={option.value}
                                id={option.value}
                                className="cursor-pointer rounded-lg px-space-md py-2 font-display text-label-md text-on-surface outline-none data-focused:bg-primary/10 data-selected:bg-primary/15 data-selected:text-primary"
                            >
                                {option.label}
                            </ListBoxItem>
                        ))}
                    </ListBox>
                </Popover>
            </Select>
            {message && (
                <p role="alert" className="font-display text-label-sm text-error">
                    {message}
                </p>
            )}
        </div>
    )
}

interface TagInputProps {
    suggestions?: string[]
    placeholder?: string
}

export function TagInput({ suggestions = [], placeholder = "+ add tag (Enter)" }: TagInputProps) {
    const field = useFieldContext<string[]>()
    const [draft, setDraft] = useState("")
    const tags = field.state.value ?? []

    const addTag = (raw: string) => {
        const value = raw.trim().replace(/^#/, "")
        if (!value || tags.includes(value)) return
        field.handleChange([...tags, value])
    }

    const removeTag = (tag: string) => {
        field.handleChange(tags.filter((value) => value !== tag))
    }

    return (
        <div className="flex flex-col gap-space-sm">
            <div className="flex flex-wrap items-center gap-space-xs rounded-[1rem] bg-surface-container-lowest p-space-sm">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-space-sm py-1 font-display text-label-sm text-primary"
                    >
                        #{tag}
                        <button type="button" aria-label={`Remove ${tag}`} onClick={() => removeTag(tag)}>
                            <X className="size-3" />
                        </button>
                    </span>
                ))}
                <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                            addTag(draft)
                            setDraft("")
                        }
                    }}
                    placeholder={placeholder}
                    className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none"
                />
            </div>
            {suggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-space-xs font-display text-label-sm text-on-surface-variant">
                    <span>Suggested:</span>
                    {suggestions
                        .filter((suggestion) => !tags.includes(suggestion))
                        .map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTag(suggestion)}
                                className="rounded-full px-1.5 py-0.5 text-primary transition-colors hover:bg-primary/10"
                            >
                                +{suggestion}
                            </button>
                        ))}
                </div>
            )}
        </div>
    )
}
