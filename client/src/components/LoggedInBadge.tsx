import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import {
    Button,
    Dialog,
    Heading,
    Menu,
    MenuItem,
    MenuTrigger,
    Modal,
    ModalOverlay,
    Popover,
} from "react-aria-components"
import { ChevronDown } from "lucide-react"
import { useLogout, useSession } from "@/lib/session"

export default function LoggedInBadge() {
    const { isAuthenticated, user } = useSession()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const logoutMutation = useLogout()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    if (!isAuthenticated || !user || pathname === "/login") return null

    const handleConfirm = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                setIsConfirmOpen(false)
                navigate("/login")
            },
        })
    }

    return (
        <>
            <MenuTrigger>
                <Button
                    aria-label={`Logged in as ${user.email}. Open account menu`}
                    className="fixed top-4 right-4 z-50 flex max-w-[220px] items-center gap-space-xs rounded-full bg-surface-container/80 px-space-md py-1.5 font-display text-label-sm text-on-surface shadow-lg backdrop-blur-xl outline-none transition-colors data-hovered:bg-surface-container-high/80 data-focused:ring-2 data-focused:ring-primary/50"
                >
                    <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span className="truncate">{user.email}</span>
                    <ChevronDown className="size-3.5 shrink-0 text-on-surface-variant" />
                </Button>
                <Popover
                    placement="bottom end"
                    offset={8}
                    className="z-[60] min-w-[160px] rounded-xl border border-outline-variant/40 bg-surface-container/95 p-1 shadow-xl backdrop-blur-xl outline-none data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0"
                >
                    <Menu className="outline-none">
                        <MenuItem
                            onAction={() => setIsConfirmOpen(true)}
                            className="cursor-pointer rounded-lg px-space-md py-2 font-display text-label-sm text-error outline-none data-focused:bg-error/10"
                        >
                            Log out
                        </MenuItem>
                    </Menu>
                </Popover>
            </MenuTrigger>

            <ModalOverlay
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
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
                            Are you sure you want to log out of {user.email}?
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
                                onPress={() => setIsConfirmOpen(false)}
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
        </>
    )
}
