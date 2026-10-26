import { FC } from "react";

import { Code } from "./Highlight";

export type CodeBlockProps = {
  code: string;
  language?: string;
  blockType: "code";
};

type Props = CodeBlockProps & {
  className?: string;
};

export const CodeBlock: FC<Props> = ({ className, code, language }) => {
  return (
    <div className={[className, "not-prose"].filter(Boolean).join(" ")}>
      <Code code={code} language={language} />
    </div>
  );
};
