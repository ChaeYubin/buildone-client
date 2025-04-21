import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  ReactElement,
} from "react";

import isSlottable from "@/utils/react-utils/is-slottable";

import SlotClone from "./slot-clone";

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export default function Slot(props: SlotProps) {
  const { children, ...slotProps } = props;

  const childrenArray = Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children as ReactElement<{
      children?: ReactNode;
    }>;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (Children.count(newElement) > 1) return Children.only(null);
        return isValidElement(newElement) ? newElement.props.children : null;
      }
      return child;
    });

    return (
      <SlotClone {...slotProps}>
        {isValidElement(newElement)
          ? cloneElement(newElement, { ...newElement.props }, newChildren)
          : null}
      </SlotClone>
    );
  }

  return <SlotClone {...slotProps}>{children}</SlotClone>;
}
