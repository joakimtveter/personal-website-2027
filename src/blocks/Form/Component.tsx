import type { FormFieldBlock, Form as FormType } from "@payloadcms/plugin-form-builder/types";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { revalidateLogic } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { FC, useState } from "react";

import RichText from "#/components/RichText";
import { Button } from "#/components/ui/button";
import type { Messages } from "#/i18n/messages";
import { useLocale, useMessages } from "#/i18n/useLocale";
import { getClientSideURL } from "#/utilities/getURL";
import { isInternalHref, localizeHref } from "#/utilities/localizeHref";

import { fields } from "./fields";
import { useAppForm } from "./form";

export type FormBlockType = {
  blockName?: string;
  blockType?: "formBlock";
  enableIntro: boolean;
  form: FormType;
  introContent?: SerializedEditorState;
};

type InputField = Extract<FormFieldBlock, { name: string }>;

const emailPattern = /^\S[^\s@]*@\S+$/;

/** Fields that hold a value and have a component here (a message block is display-only) */
const isInputField = (field: FormFieldBlock): field is InputField =>
  "name" in field && field.blockType in fields;

const getDefaultValues = (formFields: FormFieldBlock[] | undefined): Record<string, unknown> =>
  Object.fromEntries(
    (formFields ?? [])
      .filter(isInputField)
      // Unset defaults are stored as null, which would leave inputs uncontrolled at first
      .map((field) => [
        field.name,
        ("defaultValue" in field ? field.defaultValue : null) ??
          (field.blockType === "checkbox" ? false : ""),
      ]),
  );

const getValidator =
  (field: InputField, t: Messages) =>
  ({ value }: { value: unknown }) => {
    if (field.required && (value === "" || value === false || value == null))
      return t.fieldRequired;
    if (
      field.blockType === "email" &&
      typeof value === "string" &&
      value &&
      !emailPattern.test(value)
    ) {
      return t.invalidEmail;
    }
    return undefined;
  };

export const FormBlock: FC<
  {
    id?: string;
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel },
    introContent,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>();
  const [error, setError] = useState<{ message: string; status?: string } | undefined>();
  const router = useRouter();
  const locale = useLocale();
  const t = useMessages();

  const form = useAppForm({
    defaultValues: getDefaultValues(formFromProps.fields),
    // Validate on submit, then re-validate on every change
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      setError(undefined);

      const dataToSend = Object.entries(value).map(([name, fieldValue]) => ({
        field: name,
        value: fieldValue,
      }));

      // delay loading indicator by 1s
      const loadingTimerID = setTimeout(() => {
        setIsLoading(true);
      }, 1000);

      try {
        const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
          body: JSON.stringify({
            form: formID,
            submissionData: dataToSend,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        const res = await req.json();

        clearTimeout(loadingTimerID);

        if (req.status >= 400) {
          setIsLoading(false);

          setError({
            message: res.errors?.[0]?.message || "Internal Server Error",
            status: res.status,
          });

          return;
        }

        setIsLoading(false);
        setHasSubmitted(true);

        if (confirmationType === "redirect" && redirect) {
          const { url } = redirect;

          if (url && isInternalHref(url)) void router.navigate({ href: localizeHref(url, locale) });
          else if (url) window.location.assign(url);
        }
      } catch (err) {
        console.warn(err);
        clearTimeout(loadingTimerID);
        setIsLoading(false);
        setError({
          message: t.somethingWentWrong,
        });
      }
    },
  });

  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="border-border rounded-[0.8rem] border p-4 lg:p-6">
        {!isLoading && hasSubmitted && confirmationType === "message" && (
          <RichText data={confirmationMessage} />
        )}
        {isLoading && !hasSubmitted && <p>{t.loading}</p>}
        {error && <div>{`${error.status || "500"}: ${error.message || ""}`}</div>}
        {!hasSubmitted && (
          <form
            id={formID}
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <div className="mb-4 last:mb-0">
              {formFromProps.fields?.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: FC<any> | undefined =
                  fields[field.blockType as keyof typeof fields];
                if (!Field) return null;

                return (
                  <div className="mb-6 last:mb-0" key={index}>
                    {isInputField(field) ? (
                      <form.AppField
                        name={field.name}
                        validators={{ onDynamic: getValidator(field, t) }}
                      >
                        {() => <Field form={formFromProps} {...field} />}
                      </form.AppField>
                    ) : (
                      <Field form={formFromProps} {...field} />
                    )}
                  </div>
                );
              })}
            </div>

            <Button form={formID} type="submit" variant="default">
              {submitButtonLabel}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
