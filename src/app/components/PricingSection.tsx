'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Basic',
    price: { monthly: 4.99, yearly: 3.99 },
    description: 'Essential safety for one child',
    features: [
      'Real-time GPS tracking',
      'Heart rate monitoring',
      'SOS panic button',
      '1 child device',
      '5 safe contacts',
      'Email alerts',
    ],
    missing: ['Geo-fencing', 'Fall detection', 'Audio recording', 'Weekly reports'],
    cta: 'Start Free Trial',
    color: 'border-border',
    badge: null,
  },
  {
    name: 'Pro',
    price: { monthly: 9.99, yearly: 7.99 },
    description: 'Complete protection for one child',
    features: [
      'Everything in Basic',
      'Geo-fencing (up to 5 zones)',
      'Fall detection',
      'Audio distress recording',
      'Weekly health reports',
      'SMS + push alerts',
      'Priority support',
    ],
    missing: ['Multiple children', 'Family dashboard'],
    cta: 'Start Free Trial',
    color: 'border-primary/60',
    badge: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Family',
    price: { monthly: 19.99, yearly: 15.99 },
    description: 'Full safety suite for the whole family',
    features: [
      'Everything in Pro',
      'Up to 5 children',
      'Family dashboard',
      'Unlimited geo-fencing',
      'AI distress detection',
      'Dedicated account manager',
      '24/7 phone support',
    ],
    missing: [],
    cta: 'Start Free Trial',
    color: 'border-secondary/40',
    badge: 'Best Value',
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-radial from-primary/4 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">Simple Pricing</span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground mt-4 mb-4">
            Peace of mind for
            <br /><span className="text-gradient">every budget</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-muted rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] ${!yearly ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-2 ${yearly ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Yearly
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS?.map((plan, i) => (
            <div
              key={plan?.name}
              className={`glass-card rounded-2xl p-7 flex flex-col border-2 transition-all duration-300 hover:-translate-y-1 relative ${plan?.color} ${plan?.highlight ? 'glow-primary' : ''}`}
            >
              {plan?.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${plan?.highlight ? 'bg-primary text-primary-foreground' : 'bg-secondary text-white'}`}>
                  {plan?.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">{plan?.name}</h3>
                <p className="text-muted-foreground text-sm">{plan?.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="font-display text-4xl font-semibold text-foreground">
                    ${yearly ? plan?.price?.yearly : plan?.price?.monthly}
                  </span>
                  <span className="text-muted-foreground text-sm pb-1">/mo</span>
                </div>
                {yearly && (
                  <div className="text-primary text-xs mt-1">Billed annually · Save ${((plan?.price?.monthly - plan?.price?.yearly) * 12)?.toFixed(0)}/yr</div>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {plan?.features?.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <svg width="16" height="16" fill="#00D4AA" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {f}
                  </li>
                ))}
                {plan?.missing?.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground/50">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`py-3.5 rounded-xl text-sm font-semibold text-center transition-all min-h-[44px] flex items-center justify-center ${plan?.highlight ? 'btn-primary' : 'btn-outline'}`}
              >
                {plan?.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          All plans include 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}