import './globals.css';

export const metadata = {
  title: 'CalendarIO',
  description: 'Il tuo calendario condiviso',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
