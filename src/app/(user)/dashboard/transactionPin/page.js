import TransactionPin from "./pin";

export const metadata = {
  title: "Create Transaction",
    robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return <TransactionPin />;
}