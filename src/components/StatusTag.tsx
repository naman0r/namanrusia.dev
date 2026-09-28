import type { Status } from "@/content/projects";

const styles: Record<Status, string> = {
  Live: "bg-live text-ink",
  Released: "bg-bone text-ink",
  "In progress": "bg-accent text-ink",
  Shipped: "border border-current",
  Archived: "border border-dashed border-current opacity-70",
};

export function StatusTag({ status }: { status: Status }) {
  return <span className={`label px-1.5 py-px text-[10px] leading-4 ${styles[status]}`}>{status}</span>;
}
