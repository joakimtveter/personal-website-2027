import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { FC } from "react";

import RichText from "#/components/RichText";

import { Width } from "../Width";

export const Message: FC<{ message: SerializedEditorState }> = ({ message }) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText data={message} />}
    </Width>
  );
};
