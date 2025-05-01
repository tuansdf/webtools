import { cn } from "@/utils/classnames.ts";
import { ComponentProps, splitProps } from "solid-js";

interface Props extends ComponentProps<"div"> {
  variant?: "info" | "danger" | "dark" | "light";
}

export const Alert = (props: Props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return <div class={cn(`alert alert-${local.variant || "info"}`, local.class)} {...others}></div>;
};
