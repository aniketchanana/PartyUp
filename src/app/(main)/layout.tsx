export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="text-muted-foreground border-t py-4 text-center text-sm">
        Made by Aniket &amp; Cursor 🤘
      </footer>
    </>
  );
}
