import { create } from 'zustand'

type Toggles = {
    socials: boolean,
    contact: boolean
}

interface toggleState {
    toggles: Toggles
    toggleBtn: (btn: keyof toggleState["toggles"]) => void
}

export const useBtnToggle = create<toggleState>()((set) => ({
    toggles: {
        socials: false,
        contact: false,
    },
    toggleBtn: (btn) => set((state) => ({
        toggles: {
            ...state.toggles,
            [btn]: !state.toggles[btn]
        }
    }))
}))