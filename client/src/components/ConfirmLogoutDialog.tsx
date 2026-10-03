import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components"
import { useLogout } from "@/lib/session"

interface ConfirmLogoutDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    email?: string
    onLoggedOut: () => void
}

export default function ConfirmLogoutDialog({
    isOpen,
    onOpenChange,
    email,
    onLoggedOut,
}: ConfirmLogoutDialogProps) {
    const logoutMutation = useLogout()

    const handleConfirm = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                onOpenChange(false)
                onLoggedOut()
            },
        })
    }

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-gutter backdrop-blur-sm data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0"
        >
            <Modal className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-surface-container p-space-xl shadow-2xl outline-none">
                <Dialog role="alertdialog" className="flex flex-col gap-space-md outline-none">
                    <Heading
                        slot="title"
                        className="font-display text-headline-sm font-semibold text-on-surface"
                    >
                        Log out?
                    </Heading>
                    <p className="font-display text-body-sm text-on-surface-variant">
                        Are you sure you want to log out{email ? ` of ${email}` : ""}?
                    </p>

                    {logoutMutation.isError && (
                        <p
                            role="alert"
                            className="rounded-[1rem] bg-surface-container-lowest px-space-md py-2 font-display text-label-sm text-error"
                        >
                            Couldn&apos;t log out. Try again.
                        </p>
                    )}

                    <div className="mt-space-xs flex justify-end gap-space-sm">
                        <Button
                            autoFocus
                            isDisabled={logoutMutation.isPending}
                            onPress={() => onOpenChange(false)}
                            className="cursor-pointer rounded-[1rem] px-space-md py-2 font-display text-label-md text-on-surface-variant outline-none transition-colors data-hovered:bg-surface-container-high data-focused:ring-2 data-focused:ring-primary/50 data-disabled:cursor-default data-disabled:opacity-70"
                        >
                            Cancel
                        </Button>
                        <Button
                            isDisabled={logoutMutation.isPending}
                            onPress={handleConfirm}
                            className="cursor-pointer rounded-[1rem] bg-error px-space-md py-2 font-display text-label-md font-medium text-on-error outline-none transition-opacity data-hovered:opacity-90 data-focused:ring-2 data-focused:ring-error/50 data-disabled:cursor-default data-disabled:opacity-70"
                        >
                            {logoutMutation.isPending ? "Logging out…" : "Log out"}
                        </Button>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    )
}
