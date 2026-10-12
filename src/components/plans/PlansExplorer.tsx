/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Star, Check, FileText, ArrowRight } from 'lucide-react';
import { AVAILABLE_PLANS } from '../../data/mockData';
import { MedicarePlan } from '../../types/medicare';
import { formatCurrency } from '../../utils/helpers';
import { PlanComparisonModal } from '../modals/PlanComparisonModal';

interface PlansExplorerProps {
  onSelectPlanForEnrollment: (plan: MedicarePlan) => void;
  selectedPlanId: string;
}

export const PlansExplorer: React.FC<PlansExplorerProps> = ({
  onSelectPlanForEnrollment,
  selectedPlanId,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const filteredPlans = AVAILABLE_PLANS.filter((plan) => {
    const matchesCategory = categoryFilter === 'all' || plan.category === categoryFilter;
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            2026 CMS Rate &amp; Benefit Directory
          </span>
          <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
            Compare Medicare Health &amp; Drug Plans
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Browse certified Medicare Advantage (Part C), standalone Part D Prescription Drug, and Medigap supplemental coverage plans approved in your service area.
          </p>
        </div>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Launch Side-by-Side Comparison</span>
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          {[
            { id: 'all', label: 'All Plans' },
            { id: 'advantage', label: 'Medicare Advantage (Part C)' },
            { id: 'original', label: 'Original Medicare' },
            { id: 'part_d', label: 'Part D Drug Plans' },
            { id: 'medigap', label: 'Medigap Supplements' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by carrier, dental, insulin..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
          />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border p-6 flex flex-col justify-between transition-all hover:shadow-md ${
              selectedPlanId === plan.id
                ? 'border-blue-700 ring-2 ring-blue-700 shadow-xs'
                : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {plan.carrier}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-slate-700">{plan.rating} Stars</span>
                  </div>
                </div>
                {selectedPlanId === plan.id && (
                  <span className="text-[10px] font-bold text-white bg-blue-700 px-2 py-0.5 rounded-xs">
                    Current Choice
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 font-display mt-2 mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mb-4">{plan.planCode}</p>

              {/* Monthly Premium Callout */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {plan.monthlyPremium === 0 ? '$0' : formatCurrency(plan.monthlyPremium)}
                </span>
                <span className="text-xs text-slate-500 font-medium"> / month</span>
                <div className="text-[11px] text-slate-500 mt-1">
                  Medical Deductible: <strong className="font-mono text-slate-700">{plan.annualDeductible === 0 ? '$0' : formatCurrency(plan.annualDeductible)}</strong>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Coverage Highlights:
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-[11px] text-blue-900 mb-4">
                <span className="font-semibold">Recommended for: </span>
                {plan.idealFor}
              </div>
            </div>

            <button
              onClick={() => onSelectPlanForEnrollment(plan)}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                selectedPlanId === plan.id
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>{selectedPlanId === plan.id ? 'Selected In Enrollment' : 'Enroll In This Plan'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Side by side compare modal */}
      <PlanComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectPlan={(plan) => onSelectPlanForEnrollment(plan)}
        selectedPlanId={selectedPlanId}
      />
    </div>
  );
};
