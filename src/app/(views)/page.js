import TradeDesk from "../../components/ui/tradeDesk";
import FeaturesSection from "../../components/ui/featureSection";
import XenraHero from "../../components/ui/herosection";
import ServicesGrid from "../../components/ui/servicesGrid";
import HowItWorks from "../../components/ui/howitworks";
import GiftCardFAQ from "../../components/ui/giftcardfaq";

export default function Index() {
  return (
    <>
    <XenraHero />
    <FeaturesSection />
    <ServicesGrid />
    <TradeDesk />
    <HowItWorks />
    <GiftCardFAQ />

    </>
  );
}
