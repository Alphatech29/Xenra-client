import GiftcardPurchasePage from "./purchase";

export const metadata = {
  title: "Buy Gift Card",
    robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return <GiftcardPurchasePage />;
}