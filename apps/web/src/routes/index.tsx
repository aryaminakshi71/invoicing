import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, DollarSign, Clock, Zap, Shield, BarChart3, ArrowRight, Check, Receipt, CreditCard } from "lucide-react";

const features = [
  { 
    icon: FileText, 
    title: "Professional Invoices", 
    description: "Create beautiful, professional invoices in seconds. Customize templates to match your brand." 
  },
  { 
    icon: DollarSign, 
    title: "Payment Tracking", 
    description: "Track payments, send reminders, and manage your cash flow with ease." 
  },
  { 
    icon: Clock, 
    title: "Automated Reminders", 
    description: "Set up automatic payment reminders to reduce late payments and improve cash flow." 
  },
  { 
    icon: Zap, 
    title: "Quick Setup", 
    description: "Get started in minutes. Import clients, create invoices, and start getting paid faster." 
  },
  { 
    icon: Shield, 
    title: "Secure & Compliant", 
    description: "Bank-level security with GDPR compliance. Your data is safe and secure." 
  },
  { 
    icon: BarChart3, 
    title: "Financial Reports", 
    description: "Generate detailed reports on revenue, outstanding payments, and financial insights." 
  },
];

const pricingPlans = [
  { 
    name: "Starter", 
    price: 15, 
    features: [
      "Up to 50 invoices/month",
      "Basic templates",
      "Payment tracking",
      "Email support",
      "Mobile app access"
    ], 
    popular: false 
  },
  { 
    name: "Professional", 
    price: 39, 
    features: [
      "Unlimited invoices",
      "Custom branding",
      "Automated reminders",
      "Advanced reporting",
      "Multi-currency support",
      "Priority support",
      "API access"
    ], 
    popular: true 
  },
  { 
    name: "Enterprise", 
    price: 99, 
    features: [
      "Unlimited everything",
      "White-label solution",
      "Custom workflows",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
      "Training & onboarding"
    ], 
    popular: false 
  },
];

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const handleTryDemo = () => {
    // Set demo mode and navigate to app
    localStorage.setItem("demo_mode", "true");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Invoice Management
            <span className="text-primary"> Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create professional invoices, track payments, and get paid faster.
            Everything you need to manage your invoicing in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/app/dashboard"
              onClick={handleTryDemo}
              className="bg-card text-primary px-8 py-3 rounded-lg font-semibold border-2 border-primary hover:bg-green-50 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need to Get Paid
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features to streamline your invoicing process
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-20 bg-card">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works for your business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-card p-8 rounded-xl shadow-lg border-2 ${
                plan.popular ? "border-primary scale-105" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 rounded-t-lg -mt-8 -mx-8 mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`w-full py-3 rounded-lg font-semibold transition-colors block text-center ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-green-700"
                    : "bg-secondary text-secondary-foreground hover:bg-green-100"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Paid Faster?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses streamlining their invoicing process
          </p>
          <Link
            to="/signup"
            className="bg-card text-primary px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
