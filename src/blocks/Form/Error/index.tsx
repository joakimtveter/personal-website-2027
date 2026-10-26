import { FC } from "react";
import { useFieldContext } from "../form";

export const Error: FC = () => {
  const field = useFieldContext<unknown>();
  const [error] = field.state.meta.errors;

  if (!error) return null;

  return <div className="mt-2 text-sm text-red-500">{String(error)}</div>;
};
