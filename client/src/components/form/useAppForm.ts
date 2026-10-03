import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./context"
import {
    CheckboxField,
    PasswordField,
    SegmentedField,
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
        SegmentedField,
        TagInput,
    },
    formComponents: {
        SubmitButton,
    },
})
