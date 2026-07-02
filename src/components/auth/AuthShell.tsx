// Full-page auth layout — centered card over public/bg.jpg (sharp, no overlay).

type AuthShellProps = {
  children: React.ReactNode;
};

/**
 * Fills the viewport below the navbar so loading states never collapse the page.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div
      className="flex min-h-[calc(100dvh-3.5rem)] w-full flex-1 items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="flex w-full max-w-md justify-center">{children}</div>
    </div>
  );
}
