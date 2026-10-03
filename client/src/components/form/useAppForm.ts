import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./context"
import {
    CheckboxField,
    PasswordField,
    SelectField,
    TagInput,
    TextAreaField,
    TextField,
} from "./Fields"
import { SubmitButton } from "./SubmitButton"

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        PasswordField,
        TextAreaField,
        CheckboxField,
        SelectField,
        TagInput,
    },
    formComponents: {
        SubmitButton,
    },
})
