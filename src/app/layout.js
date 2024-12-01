import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
/**
 * The root layout component.
 *
 * This component is the root of the Next.js tree, and is rendered once per
 * request. It is responsible for rendering the HTML document structure.
 *
 * @param {{ children: ReactNode[] }} props The props object.
 * @returns {ReactElement} The component.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <title>rpp</title>
      </head>
      {/* The body element contains all the content of the page. */}
      <body>
        <header className="d-flex p-2 flex-row mb-3 align-items-baseline">
          <h1>random post page (rpp)</h1>
          <Link href="/newPost" className="btn btn-primary" style={{ marginLeft: "auto" }}>new post</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
