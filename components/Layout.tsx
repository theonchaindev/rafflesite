import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
  noFooter?: boolean;
}

export default function Layout({ children, noFooter }: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: "64px" }}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
