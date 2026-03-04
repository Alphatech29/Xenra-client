import SellGiftCardForm from "./sellGiftcard";

export const metadata = {
  title: "Sell Gift Card",
    robots: {
    index: false,
    follow: false,
  },
};


export default function Page() {
  return <SellGiftCardForm />;
}