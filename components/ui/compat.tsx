/**
 * HeroUI v2 → v3 compatibility shim
 * All pages import from here to avoid rewriting JSX for the v3 compound-component API.
 */
"use client";

import React, { useState, useEffect, type ReactNode, type CSSProperties } from "react";
import ReactDOM from "react-dom";
import {
  Button as HeroButton,
  Chip as HeroChip,
  Spinner as HeroSpinner,
  Separator,
} from "@heroui/react";
import NextLink from "next/link";

// ─────────────────────────────────────────────
// Re-exports that work as-is in v3
// ─────────────────────────────────────────────
export { Separator as Divider };

// ─────────────────────────────────────────────
// useDisclosure  (was from @heroui/react in v2)
// ─────────────────────────────────────────────
export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onOpenChange: setIsOpen,
  };
}

// ─────────────────────────────────────────────
// Button  (maps v2 color/variant/isLoading/as props)
// ─────────────────────────────────────────────
type V2Color = "primary" | "danger" | "success" | "warning" | "default" | "secondary";
type V3Variant = "primary" | "secondary" | "tertiary" | "ghost" | "outline" | "danger" | "danger-soft";

const COLOR_TO_VARIANT: Record<V2Color, V3Variant> = {
  primary: "primary",
  danger: "danger",
  success: "secondary",
  warning: "tertiary",
  default: "ghost",
  secondary: "secondary",
};
const V2_VARIANT_MAP: Record<string, V3Variant> = {
  flat: "ghost",
  solid: "primary",
  bordered: "outline",
  light: "ghost",
  shadow: "primary",
  faded: "ghost",
};

interface ButtonProps {
  children?: ReactNode;
  color?: V2Color;
  variant?: string;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  isLoading?: boolean;
  isPending?: boolean;
  isIconOnly?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  onClick?: () => void;
  as?: React.ElementType;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
}

export function Button({
  children,
  color,
  variant,
  isLoading,
  isPending,
  as: As,
  href,
  onPress,
  onClick,
  ...rest
}: ButtonProps) {
  const loading = isLoading || isPending;
  const v3Variant: V3Variant =
    color ? COLOR_TO_VARIANT[color] :
    variant ? (V2_VARIANT_MAP[variant] ?? (variant as V3Variant)) :
    "ghost";

  const handlePress = onPress || onClick;

  const button = (
    <HeroButton
      variant={v3Variant}
      isDisabled={rest.isDisabled || loading}
      onPress={handlePress}
      size={rest.size}
      isIconOnly={rest.isIconOnly}
      fullWidth={rest.fullWidth}
      className={rest.className}
      type={rest.type}
      style={rest.style}
    >
      {loading ? <span className="opacity-60">Cargando…</span> : children}
    </HeroButton>
  );

  if (As && href) {
    return <As href={href} className="inline-flex">{button}</As>;
  }
  if (href) {
    return <NextLink href={href} className="inline-flex">{button}</NextLink>;
  }
  return button;
}

// ─────────────────────────────────────────────
// Chip  (maps v2 variant="flat" → "soft")
// ─────────────────────────────────────────────
interface ChipProps {
  children?: ReactNode;
  color?: "default" | "success" | "warning" | "danger" | "primary" | "secondary" | "accent";
  variant?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}
const CHIP_VARIANT_MAP: Record<string, "primary" | "secondary" | "soft" | "tertiary"> = {
  flat: "soft",
  solid: "primary",
  bordered: "secondary",
  faded: "soft",
  dot: "soft",
  light: "soft",
};
export function Chip({ color, variant, ...rest }: ChipProps) {
  const v3Color = color === "primary" ? "accent" : color === "secondary" ? "accent" : color;
  const v3Variant = variant ? (CHIP_VARIANT_MAP[variant] ?? "soft") : "soft";
  return <HeroChip color={v3Color as any} variant={v3Variant} {...rest} />;
}

// ─────────────────────────────────────────────
// Spinner  (adds label prop)
// ─────────────────────────────────────────────
interface SpinnerProps { label?: string; size?: "sm" | "md" | "lg"; color?: string; className?: string; }
export function Spinner({ label, ...rest }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <HeroSpinner {...rest as any} />
      {label && <span className="text-sm text-muted">{label}</span>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Card  (v2 compound API shim)
// ─────────────────────────────────────────────
export function Card({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-surface shadow-surface border border-border ${className ?? ""}`}>
      {children}
    </div>
  );
}
export function CardHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={`px-5 pt-4 pb-1 ${className ?? ""}`}>{children}</div>;
}
export function CardBody({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className ?? ""}`}>{children}</div>;
}
export function CardFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={`px-5 pt-1 pb-4 flex items-center gap-2 ${className ?? ""}`}>{children}</div>;
}

// ─────────────────────────────────────────────
// Modal  (pure HTML + Tailwind portal — no HeroUI v3 dependency)
// ─────────────────────────────────────────────
const MODAL_SIZE: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-4xl",
  full: "max-w-full",
};
interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}
export function Modal({ isOpen, onClose, children, size = "md" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!isOpen || !mounted) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onClose?.()}
      />
      <div
        className={`relative z-10 w-full ${MODAL_SIZE[size] ?? "max-w-lg"} bg-surface rounded-xl shadow-xl border border-border max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
export function ModalContent({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
export function ModalHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`px-5 pt-4 pb-3 border-b border-border font-semibold text-lg ${className ?? ""}`}>
      {children}
    </div>
  );
}
export function ModalBody({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className ?? ""}`}>{children}</div>;
}
export function ModalFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`px-5 pb-4 pt-3 border-t border-border flex justify-end gap-2 ${className ?? ""}`}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Input  (v2 API: label, value, onValueChange, isRequired, type, min/max/step)
// ─────────────────────────────────────────────
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  description?: string;
  errorMessage?: string;
  startContent?: React.ReactNode;
}
export function Input({ label, value, onValueChange, isRequired, isDisabled, description, errorMessage, className, startContent, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {isRequired && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {startContent && (
          <span className="absolute left-3 flex items-center pointer-events-none">{startContent}</span>
        )}
        <input
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          disabled={isDisabled || rest.disabled}
          required={isRequired}
          className={`w-full rounded-[--field-radius] border border-border bg-field py-2 text-sm text-field-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 ${startContent ? "pl-9 pr-3" : "px-3"} ${className ?? ""}`}
          {...rest}
        />
      </div>
      {description && <p className="text-xs text-muted">{description}</p>}
      {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Textarea  (v2 API: label, value, onValueChange, minRows)
// ─────────────────────────────────────────────
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  minRows?: number;
  description?: string;
  errorMessage?: string;
}
export function Textarea({ label, value, onValueChange, isRequired, isDisabled, minRows = 3, description, errorMessage, className, ...rest }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {isRequired && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={isDisabled || rest.disabled}
        required={isRequired}
        rows={minRows}
        className={`w-full rounded-[--field-radius] border border-border bg-field px-3 py-2 text-sm text-field-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className ?? ""}`}
        {...rest}
      />
      {description && <p className="text-xs text-muted">{description}</p>}
      {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Select / SelectItem  (v2 API with selectedKeys/onSelectionChange)
// Uses React.Children to extract key as option value
// ─────────────────────────────────────────────
interface SelectProps {
  label?: string;
  placeholder?: string;
  selectedKeys?: Iterable<string> | string[];
  onSelectionChange?: (keys: Set<string>) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}
export function Select({
  label,
  placeholder,
  selectedKeys,
  onSelectionChange,
  isRequired,
  isDisabled,
  children,
  className,
  "aria-label": ariaLabel,
}: SelectProps) {
  const keysArray = selectedKeys ? [...(selectedKeys as Iterable<string>)] : [];
  const value = keysArray[0] ?? "";

  // Extract options from SelectItem children via React.Children + child.key
  const options: { value: string; label: ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const rawKey = child.key;
      // React may prefix keys with ".$" in some contexts
      const cleanKey = rawKey ? String(rawKey).replace(/^\.\$/, "").replace(/^\$/, "") : "";
      // Also support explicit `value` prop override
      const childValue = (child.props as any).value ?? cleanKey;
      options.push({ value: childValue, label: (child.props as any).children });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onSelectionChange?.(new Set(val ? [val] : []));
  };

  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {isRequired && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        required={isRequired}
        aria-label={ariaLabel}
        className="w-full rounded-[--field-radius] border border-border bg-field px-3 py-2 text-sm text-field-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* Always render an empty option when nothing is selected to prevent the browser
            from visually "pre-selecting" the first real option while state is empty */}
        {(placeholder || !value) && <option value="">{placeholder ?? ""}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SelectItem({ children, value }: { children?: ReactNode; value?: string }) {
  // Rendered by the parent Select via React.Children — not directly rendered as DOM
  return null;
}

// ─────────────────────────────────────────────
// Table / TableHeader / TableColumn / TableBody / TableRow / TableCell
// Plain HTML table styled with HeroUI v3 CSS variables
// ─────────────────────────────────────────────
interface TableProps {
  children?: ReactNode;
  "aria-label"?: string;
  removeWrapper?: boolean;
  className?: string;
}
export function Table({ children, "aria-label": ariaLabel, className }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className={`min-w-full ${className ?? ""}`} aria-label={ariaLabel}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children?: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border bg-surface-secondary">
        {children}
      </tr>
    </thead>
  );
}

interface TableColumnProps {
  children?: ReactNode;
  className?: string;
  key?: string;
}
export function TableColumn({ children, className }: TableColumnProps) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted ${className ?? ""}`}>
      {children}
    </th>
  );
}

interface TableBodyProps {
  children?: ReactNode;
  emptyContent?: ReactNode;
  isLoading?: boolean;
  loadingContent?: ReactNode;
}
export function TableBody({ children, emptyContent, isLoading, loadingContent }: TableBodyProps) {
  const rows = React.Children.toArray(children);
  return (
    <tbody>
      {isLoading && loadingContent ? (
        <tr><td colSpan={99} className="py-8 text-center">{loadingContent}</td></tr>
      ) : rows.length === 0 && emptyContent ? (
        <tr><td colSpan={99} className="py-8 text-center text-sm text-muted">{emptyContent}</td></tr>
      ) : (
        children
      )}
    </tbody>
  );
}

export function TableRow({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <tr className={`border-b border-border last:border-0 hover:bg-surface-secondary transition-colors ${className ?? ""}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-sm ${className ?? ""}`}>
      {children}
    </td>
  );
}

// ─────────────────────────────────────────────
// Checkbox / CheckboxGroup  (v2 API shim)
// ─────────────────────────────────────────────
import { Checkbox as HeroCheckbox, CheckboxGroup as HeroCheckboxGroup } from "@heroui/react";

interface CheckboxProps {
  children?: ReactNode;
  value?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}
export function Checkbox({ children, value, isSelected, isDisabled, onChange, className }: CheckboxProps) {
  return (
    <HeroCheckbox
      value={value}
      isSelected={isSelected}
      isDisabled={isDisabled}
      onChange={onChange}
      className={className}
    >
      <HeroCheckbox.Control>
        <HeroCheckbox.Indicator />
      </HeroCheckbox.Control>
      <HeroCheckbox.Content>{children}</HeroCheckbox.Content>
    </HeroCheckbox>
  );
}

interface CheckboxGroupProps {
  children?: ReactNode;
  label?: string;
  value?: string[];
  onValueChange?: (val: string[]) => void;
  className?: string;
  description?: string;
}
export function CheckboxGroup({ children, label, value, onValueChange, className, description }: CheckboxGroupProps) {
  return (
    <HeroCheckboxGroup
      value={value}
      onChange={onValueChange}
      className={className}
      aria-label={label}
    >
      {label && <p className="text-sm font-medium text-foreground mb-1">{label}</p>}
      {children}
      {description && <p className="text-xs text-muted mt-1">{description}</p>}
    </HeroCheckboxGroup>
  );
}

// ─────────────────────────────────────────────
// Link (for <Button as={Link}> pattern — just re-export Next.js Link)
// ─────────────────────────────────────────────
export { NextLink as Link };
