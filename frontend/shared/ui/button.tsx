import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
}: ButtonProps): React.JSX.Element {
  const className =
    variant === "primary"
      ? "border border-[#2563EB] bg-[#2563EB] px-4 py-2 font-semibold text-white"
      : "border border-neutral-300 bg-white px-4 py-2 font-semibold text-neutral-900";

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

type LinkButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export function LinkButton({
  children,
  href,
  variant = "primary",
}: LinkButtonProps): React.JSX.Element {
  const className =
    variant === "primary"
      ? "inline-block border border-[#2563EB] bg-[#2563EB] px-4 py-2 font-semibold text-white"
      : "inline-block border border-neutral-300 bg-white px-4 py-2 font-semibold text-neutral-900";

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
