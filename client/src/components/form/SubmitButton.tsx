import type { ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFormContext } from "./context"

interface SubmitButtonProps {
    children: ReactNode
    pendingLabel?: string
    icon?: ReactNode
    className?: string
}

export function SubmitButton({ children, pendingLabel = "Submitting…", icon, className }: SubmitButtonProps) {
    const form = useFormContext()

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "group flex w-full items-center justify-center gap-space-sm rounded-[1rem] bg-primary px-space-md py-3 font-display text-label-lg font-medium text-on-primary shadow-lg shadow-on-tertiary-container/30 transition-all duration-200 hover:bg-primary-fixed active:scale-[0.98] disabled:cursor-default disabled:opacity-90",
                        className,
                    )}
                >
                    <span>{isSubmitting ? pendingLabel : children}</span>
                    {isSubmitting ? <Loader2 className="size-[18px] animate-spin" /> : icon}
                </button>
            )}
        </form.Subscribe>
    )
}
