import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./context"
import { PasswordField, TextField } from "./Fields"
import { SubmitButton } from "./SubmitButton"

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        PasswordField,
    },
    formComponents: {
        SubmitButton,
    },
})
