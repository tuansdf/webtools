import { cn } from "@/utils/classnames.ts";
import { ComponentProps, splitProps } from "solid-js";

interface Props extends ComponentProps<"button"> {
  variant?: "primary" | "dark";
}

export const Button = (props: Props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return <button class={cn(`btn btn-${local.variant || "primary"}`, local.class)} {...others} />;
};
