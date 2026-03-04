import DataPurchaseForm from "./data";

export const metadata = {
  title: "Data Purchase",
    robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return <DataPurchaseForm />;
}