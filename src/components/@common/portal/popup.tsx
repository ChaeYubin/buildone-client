"use client";

import {
  ComponentProps,
  createContext,
  ElementType,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

import Button, { ButtonProps } from "@/components/@common/button";
import usePortalClosesByEscapeKey from "@/hooks/portal/use-portal-closes-by-escape-key";
import usePortalOpen from "@/hooks/portal/use-portal-open";
import { cn } from "@/lib/cn";
import splitChildrenByComponents from "@/utils/react-utils/split-children-by-components";

import Slot from "../slot/slot";

type PopupContextProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface PopupCommonProps {
  className?: string;
}

type PopupElementProps<T extends ElementType> = ComponentProps<T> & {
  asChild?: boolean;
};

const popupContext = createContext<PopupContextProps>({
  open: false,
  setOpen: () => {},
});

const usePopup = () => {
  const context = useContext(popupContext);
  if (!context) throw new Error("usePopup must be used within a PopupProvider");
  return context;
};

interface PopupRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function PopupRoot({
  children,
  open: openProp = false,
  onOpenChange,
}: PropsWithChildren<PopupRootProps>) {
  const { open, setOpen } = usePortalOpen(openProp, onOpenChange);

  usePortalClosesByEscapeKey(open, setOpen);

  const providerValue = useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open, setOpen],
  );

  return (
    <popupContext.Provider value={providerValue}>
      {children}
    </popupContext.Provider>
  );
}

function PopupTrigger({
  children,
  className,
  asChild = false,
}: PopupElementProps<"button">) {
  const { setOpen } = usePopup();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn("", className)}
      type="button"
      onClick={() => setOpen(true)}
    >
      {children}
    </Comp>
  );
}

function PopupPortal({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const ChildrenWithCloseButton = children;

  if (!isClient) return null;

  return createPortal(ChildrenWithCloseButton, document.body);
}

interface PopupOverlayProps {
  closeOnOverlayClick?: boolean;
}

function PopupOverlay({
  className,
  closeOnOverlayClick = true,
}: PopupCommonProps & PopupOverlayProps) {
  const { open, setOpen } = usePopup();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="presentation"
          aria-hidden
          className={cn("fixed inset-0 bg-gray-500", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, transition: { duration: 0.1 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          onClick={() => {
            if (closeOnOverlayClick) setOpen(false);
          }}
          data-ignore-click
        />
      )}
    </AnimatePresence>
  );
}

function PopupContent({ children, className }: ComponentProps<"div">) {
  const { open } = usePopup();
  const [[footer], nonContentChild] = splitChildrenByComponents(
    [PopupFooter],
    children,
  );

  return (
    <PopupPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "fixed left-[50%] top-[50%] z-[80] flex w-full max-w-300 translate-x-[-50%] translate-y-[-50%] flex-col gap-16 rounded-lg border bg-white px-16 py-24 pb-26 pt-40 shadow-xl md:max-w-450 md:px-24",
              className,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            data-ignore-click
          >
            {nonContentChild}
            {footer}
          </motion.div>
        )}
      </AnimatePresence>
      <PopupOverlay className="z-[70]" />
    </PopupPortal>
  );
}

function PopupFooter({
  children,
  className,
  asChild = false,
}: PopupElementProps<"div">) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp className={cn("mt-16 flex w-full justify-center gap-8", className)}>
      {children}
    </Comp>
  );
}

interface PopupCloseProps extends ButtonProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

function PopupClose({
  children,
  className,
  onClick = () => {},
  shape = "square",
  size = "sm",
  ...props
}: PopupCloseProps) {
  const { setOpen } = usePopup();

  const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    onClick(e);
    setOpen(false);
  };

  return (
    <Button
      className={cn("h-48 w-full max-w-120", className)}
      shape={shape}
      size={size}
      onClick={handleClick}
      aria-label="팝업 닫기"
      {...props}
    >
      {children}
    </Button>
  );
}

const Popup = {
  Root: PopupRoot,
  Trigger: PopupTrigger,
  Content: PopupContent,
  Footer: PopupFooter,
  Close: PopupClose,
};

export default Popup;
