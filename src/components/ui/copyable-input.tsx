import { Input } from "@/components/ui/input.tsx";
import { ComponentProps, createSignal } from "solid-js";

interface Props extends ComponentProps<typeof Input> {}

export const CopyableInput = (props: Props) => {
  const [copied, setCopied] = createSignal<boolean>(false);
  let copiedDeb: ReturnType<typeof setTimeout> | null = null;

  return (
    <Input
      {...props}
      label={`${props.label}${copied() ? " (copied)" : " (click to copy)"}`}
      onClick={async () => {
        const value = String(props.value || "");
        if (!value?.length) return;
        await navigator.clipboard.writeText(value);
        if (copiedDeb) {
          clearTimeout(copiedDeb);
        }
        setCopied(true);
        copiedDeb = setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    />
  );
};
