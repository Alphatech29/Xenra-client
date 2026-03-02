import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import HydrationProvider from "../HydrationProvider";

export default function ViewsLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen">
      <Header />
      {children}
      <Footer year={year} />
    </main>
  );
}