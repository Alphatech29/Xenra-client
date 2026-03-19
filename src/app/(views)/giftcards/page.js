import SellGiftCard from "../../../components/ui/sellgiftcard";
import GiftCardHero  from "../../../components/ui/giftcardhero";
import BuyGiftCard from "../../../components/ui/buygiftcard";
import Giftcardrates from "../../../components/ui/Giftcardrates";
import GiftCardFAQ from "../../../components/ui/giftcardfaq";


export default function GiftCardsPage() {
  return (
    <>
      <GiftCardHero/>
      <SellGiftCard />
      <BuyGiftCard />
      <Giftcardrates />
      <GiftCardFAQ />
    </>
  );
}