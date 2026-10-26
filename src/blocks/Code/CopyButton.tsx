import { CopyIcon } from "@payloadcms/ui/icons/Copy";
import { useState } from "react";

import { Button } from "#/components/ui/button";

export function CopyButton({ code }: { code: string }) {
  const [text, setText] = useState("Copy");

  function updateCopyStatus() {
    if (text === "Copy") {
      setText(() => "Copied!");
      setTimeout(() => {
        setText(() => "Copy");
      }, 1000);
    }
  }

  return (
    <div className="flex justify-end align-middle">
      <Button
        className="flex gap-1"
        variant={"secondary"}
        onClick={() => {
          void navigator.clipboard.writeText(code).then(updateCopyStatus);
        }}
      >
        <p>{text}</p>
        <CopyIcon />
      </Button>
    </div>
  );
}
