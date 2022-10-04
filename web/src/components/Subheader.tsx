import React from "react";
import { Text } from "@mantine/core";

interface SubheaderProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function Subheader({ children, ...rest }: SubheaderProps) {
  return (
    <Text color="dimmed" {...rest}>
      {children}
    </Text>
  );
}
