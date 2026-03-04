import GiftCardList from "./buyGiftcard";

export const metadata = {
  title: "Buy Gift Card",
    robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return <GiftCardList />;
}