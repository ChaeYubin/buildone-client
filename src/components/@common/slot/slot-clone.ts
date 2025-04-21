import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
} from "react";

import mergeProps from "@/utils/react-utils/merge-props";

export default function SlotClone<T>(props: PropsWithChildren<T>) {
  const { children, ...slotProps } = props;

  if (isValidElement(children)) {
    const childrenProps = children.props as Record<string, unknown>;
    return cloneElement(children, mergeProps(slotProps, childrenProps));
  }

  return Children.count(children) > 1 ? Children.only(null) : null;
}
