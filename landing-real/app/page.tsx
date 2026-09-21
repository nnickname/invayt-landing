import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ProblemSection } from '@/components/problem-section'
import { TransformationSection } from '@/components/transformation-section'
import { HowItWorks } from '@/components/how-it-works'
import { BenefitsSection } from '@/components/benefits-section'
import { FounderOffer } from '@/components/founder-offer'
import { FaqSection } from '@/components/faq-section'
import { FinalCta } from '@/components/final-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <TransformationSection />
        <HowItWorks />
        <BenefitsSection />
        <FounderOffer />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
