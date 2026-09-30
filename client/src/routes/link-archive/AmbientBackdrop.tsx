export default function AmbientBackdrop() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[#09080e]">
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(60% 55% at 50% 0%, rgba(139,92,246,0.16), transparent 70%), radial-gradient(50% 45% at 88% 45%, rgba(167,139,250,0.10), transparent 70%), radial-gradient(55% 50% at 8% 82%, rgba(98,37,155,0.16), transparent 70%)",
                }}
            />
        </div>
    )
}
