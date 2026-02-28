interface SponsoredDisclosureProps {
  variant?: "inline" | "card";
}

export default function SponsoredDisclosure({ variant = "inline" }: SponsoredDisclosureProps) {
  return (
    <p
      className={
        variant === "card"
          ? "text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
          : "text-xs text-slate-500"
      }
    >
      Disclosure: Some links may be sponsored or affiliate links. NoVaNode may earn a commission at no extra cost to you.
    </p>
  );
}
