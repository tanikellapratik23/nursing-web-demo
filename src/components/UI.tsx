import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X, Download } from "lucide-react";
import { download } from "../services/csv";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className={`badge ${["Verified", "Active", "Complete", "Completed"].includes(String(children)) ? "positive" : ""}`}
    >
      {children}
    </span>
  );
}
export function Empty() {
  return (
    <div className="empty">
      No records match these filters. Try another period or search.
    </div>
  );
}
export function Export({ rows, name }: { rows: object[]; name: string }) {
  return (
    <button className="secondary" onClick={() => download(rows, name)}>
      <Download size={16} /> Export CSV
    </button>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function PageHead({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow || "PROGRAM ADMINISTRATION"}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="actions">{children}</div>
    </div>
  );
}
