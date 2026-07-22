import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { FreeTools } from "@/components/sections/FreeTools";
import { UpgradeBanner } from "@/components/sections/UpgradeBanner";
import { FeatureRows } from "@/components/sections/FeatureRows";
import { Support } from "@/components/sections/Support";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <TrustBar />
      <FreeTools />
      <UpgradeBanner />
      <FeatureRows />
      <Support />
      <FinalCta />
      <Footer />
    </main>
  );
}
