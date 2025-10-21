import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import ShopSection from "@/components/ShopSection";
import TraceSection from "@/components/TraceSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <ShopSection />
      <TraceSection />
      <ContactSection />
    </div>
  );
}
