import AirtimePurchaseForm from "./airtime";

export const metadata = {
  title: "Airtime Purchase",
    robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return <AirtimePurchaseForm />;
}