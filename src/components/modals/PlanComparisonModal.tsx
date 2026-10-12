/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check, Star } from 'lucide-react';
import { AVAILABLE_PLANS } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import { MedicarePlan } from '../../types/medicare';

interface PlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: MedicarePlan) => void;
  selectedPlanId: string;
}

export const PlanComparisonModal: React.FC<PlanComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  selectedPlanId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Compare 2026 Medicare Coverage Options</h3>
            <p className="text-xs text-slate-400">Official side-by-side coverage matrix authorized by CMS</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-slate-500 uppercase tracking-wider w-1/4 bg-slate-50">
                    Plan Feature
                  </th>
                  {AVAILABLE_PLANS.slice(0, 3).map((plan) => (
                    <th key={plan.id} className="py-3 px-4 font-semibold text-slate-900 bg-white min-w-56">
                      <div className="font-display font-bold text-sm text-blue-900">{plan.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{plan.carrier}</div>
                      <div className="flex items-center gap-1 mt-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-mono font-bold text-slate-700">{plan.rating} Stars</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Monthly Plan Premium</td>
                  {AVAILABLE_PLANS.slice(0, 3).map((plan) => (
                    <td key={plan.id} className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                      {plan.monthlyPremium === 0 ? '$0 / month' : `${formatCurrency(plan.monthlyPremium)} / mo`}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Annual Medical Deductible</td>
                  {AVAILABLE_PLANS.slice(0, 3).map((plan) => (
                    <td key={plan.id} className="py-3 px-4 font-mono">
                      {plan.annualDeductible === 0 ? '$0 Deductible' : formatCurrency(plan.annualDeductible)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Max Out-of-Pocket Cap</td>
                  {AVAILABLE_PLANS.slice(0, 3).map((plan) => (
                    <td key={plan.id} className="py-3 px-4 font-mono">
                      {plan.maxOutOfPocket === 0 ? 'No Limit (Original)' : formatCurrency(plan.maxOutOfPocket)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Doctor &amp; Hospital Network</td>
                  <td className="py-3 px-4">Any doctor nationwide accepting Medicare (No referrals)</td>
                  <td className="py-3 px-4">In-network HMO network (PCP coordinates care)</td>
                  <td className="py-3 px-4">In &amp; Out-of-network PPO flexibility</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Prescription Drugs (Part D)</td>
                  <td className="py-3 px-4 text-slate-500">Requires separate standalone Part D plan</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Included ($0 Tier 1)
                  </td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Included ($0 Tier 1)
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Dental, Vision &amp; Hearing</td>
                  <td className="py-3 px-4 text-slate-400">Not covered under Original Medicare</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Included ($2,000 allowance)</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Included ($2,500 allowance)</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Action</td>
                  {AVAILABLE_PLANS.slice(0, 3).map((plan) => (
                    <td key={plan.id} className="py-3 px-4">
                      <button
                        onClick={() => {
                          onSelectPlan(plan);
                          onClose();
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                          selectedPlanId === plan.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                      >
                        {selectedPlanId === plan.id ? 'Selected Current Plan' : 'Select This Plan'}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
