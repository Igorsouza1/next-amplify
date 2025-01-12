import { ReactNode } from "react";
import { ShapeProvider } from "@/Context/shapeContext";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ShapeProvider>{children}</ShapeProvider>
      </body>
    </html>
  );
}
