import DashboardPage from "./dashboard";

export const metadata = {
  title: "Dashboard",

  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <DashboardPage />;
}