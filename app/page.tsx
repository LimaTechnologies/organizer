import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Zap, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="flex-grow">
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Unleash Your AI Creativity
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover, create, and share powerful AI prompts. Elevate your projects with our collaborative platform.
          </p>
          <Button asChild size="lg" className="ai-button">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Prompts"
              description="Leverage cutting-edge AI technology to generate and refine your prompts."
            />
            <FeatureCard
              icon={Users}
              title="Collaborative Community"
              description="Connect with like-minded creators and share your best prompts."
            />
            <FeatureCard
              icon={Zap}
              title="Instant Inspiration"
              description="Browse a vast library of prompts to kickstart your projects."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Track Performance"
              description="Gain insights into how your prompts perform and iterate for success."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="ai-card p-6 text-center">
      <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}