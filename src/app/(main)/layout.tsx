export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        Made by Aniket &amp; Cursor using opus4.6 🤘
      </footer>
    </>
  );
}
