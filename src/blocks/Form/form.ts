import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

// Field components are picked per CMS field type in Component.tsx, so none are registered on the hook
export const { useAppForm } = createFormHook({
  fieldComponents: {},
  fieldContext,
  formComponents: {},
  formContext,
});
