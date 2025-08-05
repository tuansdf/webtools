import { cn } from "@/utils/classnames.ts";
import { ComponentProps, createSignal, createUniqueId, Show, splitProps } from "solid-js";

interface Props extends ComponentProps<"textarea"> {
  letterCount?: number;
  errorMessage?: string;
  label?: string;
  copyable?: boolean;
}

export const Textarea = (props: Props) => {
  const [local, others] = splitProps(props, ["class", "errorMessage", "letterCount", "id", "label", "copyable"]);
  const id = createUniqueId();

  const [copied, setCopied] = createSignal<boolean>(false);
  let copiedDeb: ReturnType<typeof setTimeout> | null = null;
  const handleCopy = async () => {
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
  };

  return (
    <div>
      <Show when={local.label}>
        <label for={id} class="form-label">
          {local.label} {!!local.copyable && (copied() ? "(copied)" : "(click to copy)")}
        </label>
      </Show>
      <textarea
        id={id}
        class={cn("form-control", !!local.errorMessage && "border-danger", local.class)}
        onClick={local.copyable ? handleCopy : undefined}
        {...others}
      />
      <Show when={local.errorMessage || local.letterCount === 0 || local.letterCount}>
        <div class="d-flex justify-content-between">
          <Show when={local.errorMessage} fallback={<div></div>}>
            <div class="form-text text-danger fs-6 m-0">{local.errorMessage}</div>
          </Show>
          <Show when={local.letterCount === 0 || local.letterCount}>
            <span classList={{ "text-secondary fs-6": true, "text-danger": !!local.errorMessage }}>
              {local.letterCount}
              <Show when={others.maxLength}>{`/${others.maxLength}`}</Show>
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
