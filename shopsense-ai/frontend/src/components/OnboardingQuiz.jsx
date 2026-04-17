import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';

const STEPS = [
  {
    id: 1,
    title: 'How old are you?',
    subtitle: "We'll tailor picks just for you",
    emoji: '🎂',
  },
  {
    id: 2,
    title: 'What do you love shopping for?',
    subtitle: 'Pick as many as you like',
    emoji: '🛒',
  },
  {
    id: 3,
    title: "What's your monthly shopping budget?",
    subtitle: "We'll keep recommendations in range",
    emoji: '💰',
  },
];

const AGE_GROUPS = [
  { label: '18–24', icon: '🎓', value: '18-24' },
  { label: '25–34', icon: '💼', value: '25-34' },
  { label: '35–44', icon: '🏡', value: '35-44' },
  { label: '45+', icon: '🎯', value: '45+' },
];

const INTERESTS = [
  { label: 'Electronics', icon: '💻' },
  { label: 'Fashion', icon: '👗' },
  { label: 'Home & Kitchen', icon: '🏠' },
  { label: 'Sports', icon: '⚽' },
  { label: 'Beauty', icon: '💄' },
  { label: 'Books', icon: '📚' },
  { label: 'Toys', icon: '🧸' },
  { label: 'Grocery', icon: '🛒' },
];

const BUDGETS = [
  { label: 'Under ₹2,000', value: 'under-2000', icon: '🌱' },
  { label: '₹2,000 – ₹5,000', value: '2000-5000', icon: '🌿' },
  { label: '₹5,000 – ₹10,000', value: '5000-10000', icon: '🌳' },
  { label: 'Above ₹10,000', value: 'above-10000', icon: '🚀' },
];

function OnboardingQuiz({ onComplete }) {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState('');
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState('');
  const { currentUser } = useAuth();
  const { savePreferences } = useFirestore();
  const [saving, setSaving] = useState(false);

  const toggleInterest = (label) => {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const canNext = () => {
    if (step === 1) return !!ageGroup;
    if (step === 2) return interests.length > 0;
    if (step === 3) return !!budget;
    return false;
  };

  const handleFinish = async () => {
    const prefs = { ageGroup, interests, budget };
    setSaving(true);
    try {
      if (currentUser) await savePreferences(currentUser.uid, prefs);
      onComplete?.(prefs);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="glass-card w-full max-w-md p-8 animate-slide-up">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-[#a3aac4] mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-[#091328] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#a7a5ff] to-[#645efb] rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Step header */}
        <div className="text-center mb-6">
          <p className="text-4xl mb-3" aria-hidden="true">{STEPS[step - 1].emoji}</p>
          <h2 id="onboarding-title" className="text-xl font-bold text-[#dee5ff] mb-1">
            {STEPS[step - 1].title}
          </h2>
          <p className="text-sm text-[#a3aac4]">{STEPS[step - 1].subtitle}</p>
        </div>

        {/* Step 1: Age group */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.value}
                onClick={() => setAgeGroup(ag.value)}
                aria-pressed={ageGroup === ag.value}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200
                  ${ageGroup === ag.value
                    ? 'border-[#645efb] bg-[#645efb]/20 text-[#a7a5ff]'
                    : 'border-[#40485d]/30 bg-[#091328] text-[#a3aac4] hover:border-[#645efb]/30 hover:bg-[#141f38]'
                  }`}
              >
                <span className="text-3xl" aria-hidden="true">{ag.icon}</span>
                <span className="text-sm font-medium">{ag.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((item) => (
              <button
                key={item.label}
                onClick={() => toggleInterest(item.label)}
                aria-pressed={interests.includes(item.label)}
                className={`chip flex items-center gap-1.5 ${interests.includes(item.label) ? 'selected' : ''}`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            {BUDGETS.map((b) => (
              <button
                key={b.value}
                onClick={() => setBudget(b.value)}
                aria-pressed={budget === b.value}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200
                  ${budget === b.value
                    ? 'border-[#645efb] bg-[#645efb]/20 text-[#a7a5ff]'
                    : 'border-[#40485d]/30 bg-[#091328] text-[#dee5ff] hover:border-[#645efb]/30 hover:bg-[#141f38]'
                  }`}
              >
                <span className="text-2xl" aria-hidden="true">{b.icon}</span>
                <span className="text-sm font-medium">{b.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="btn-ghost flex-1"
              aria-label="Go to previous step"
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Go to next step"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canNext() || saving}
              className="btn-primary flex-1 disabled:opacity-40"
              aria-label="Complete onboarding"
            >
              {saving ? 'Saving...' : '🚀 Get Started'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingQuiz;
