import { useState, useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResultView from '../components/test/ResultView';
import { toast } from 'sonner';

interface Question {
  id: number;
  text: string;
}

interface Domain {
  id: string;
  title: string;
  questions: Question[];
}

const domains: Domain[] = [
  {
    id: 'domain-1',
    title: 'DOMAIN 1: DOCUMENTATION',
    questions: [
      { id: 1, text: 'Do you have a complete and current set of policies for all your service lines?' },
      { id: 2, text: 'Have these policies been updated in the last 12 months?' },
      { id: 3, text: 'Do you maintain a formal version-control process?' },
      { id: 4, text: 'Are staff required to acknowledge new or updated policies?' },
    ],
  },
  {
    id: 'domain-2',
    title: 'DOMAIN 2: REGULATORY TRACKING',
    questions: [
      { id: 5, text: 'Do you monitor state-level changes relevant to your programs?' },
      { id: 6, text: 'Do you have a process to implement new regulations within 30 days?' },
      { id: 7, text: 'Have you avoided findings or citations in the past 24 months?' },
      { id: 8, text: 'Do you keep a written log of regulatory updates and the actions taken in response?' },
    ],
  },
  {
    id: 'domain-3',
    title: 'DOMAIN 3: OPERATIONAL PROCESSES',
    questions: [
      { id: 9, text: 'Do all staff complete required annual trainings?' },
      { id: 10, text: 'Do you maintain required incident reporting and corrective action documentation?' },
      { id: 11, text: 'Do you have a formal internal audit or review every year?' },
      { id: 12, text: 'Do you have a documented schedule for reviewing incidents, trends, and corrective actions? (for example, monthly or quarterly)' },
    ],
  },
  {
    id: 'domain-4',
    title: 'DOMAIN 4: ACCREDITATION READINESS',
    questions: [
      { id: 13, text: 'Are your policies aligned to your accrediting body\'s latest standards?' },
      { id: 14, text: 'Can you produce required documents within 24 hours if requested?' },
      { id: 15, text: 'Were no significant gaps found during your last review or mock assessment?' },
      { id: 16, text: 'Do you have a central, organized repository for compliance documents?' },
    ],
  },
];

const optionalQuestion = {
  id: 17,
  text: 'Are key program handbooks (client rights, privacy, emergency procedures) up-to-date?',
};

function TestPageContent() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('view') === 'result') {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
    }
  }, [searchParams]);

  const handleAnswer = (questionId: number, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    Object.values(answers).forEach((val) => {
      if (val === true) score++;
    });
    return score;
  };

  const handleSubmit = () => {
    // Get all question IDs (excluding optional)
    const allQuestionIds = domains.flatMap(domain => domain.questions.map(q => q.id));

    // Count how many questions have been answered
    const answeredQuestions = allQuestionIds.filter(id => answers[id] !== undefined && answers[id] !== null);

    // Check if at least 50% of questions are answered
    const requiredAnswers = Math.ceil(allQuestionIds.length * 0.5);

    if (answeredQuestions.length < requiredAnswers) {
      toast.error(`Please answer all the questions`);
      return;
    }

    // If validation passes, proceed with submission
    // const score = calculateScore(); // Not used here
    navigate('/test?view=result');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 w-full mx-auto">
          <ResultView score={calculateScore()} answers={answers} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-12">
        <div className="bg-[#EDF3FF] border border-[#1865FF4D] rounded-lg p-2 md:p-6 mb-8 md:mb-12">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            Core Questions (12–15 items, yes/no or multiple-choice)
          </h2>
        </div>

        <div className="space-y-8 md:space-y-12">
          {domains.map((domain) => (
            <div key={domain.id}>
              <h3 className="text-[#4E27F0] font-bold tracking-wider uppercase mb-4 md:mb-6 text-xs md:text-sm">
                {domain.title}
              </h3>
              <div className="space-y-4 md:space-y-6">
                {domain.questions.map((q) => (
                  <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 md:pb-6 last:border-0 gap-4 md:gap-0">
                    <p className="text-gray-800 text-sm md:text-base max-w-3xl">{q.id}. {q.text}</p>
                    <div className="flex gap-3 w-1/2 lg:w-full justify-end">
                      <button
                        onClick={() => handleAnswer(q.id, true)}
                        className={`flex-1 md:flex-none px-6 py-2 rounded border transition-colors ${answers[q.id] === true
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-[#EDF3FF] text-gray-600 border-[#1865FF4D] hover:bg-gray-50'
                          }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(q.id, false)}
                        className={`flex-1 md:flex-none px-6 py-2 rounded border transition-colors ${answers[q.id] === false
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-[#EDF3FF] text-gray-600 border-[#1865FF4D] hover:bg-gray-50'
                          }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Optional Question Section */}
          <div>
            <h3 className="text-[#4E27F0] font-bold tracking-wider uppercase mb-4 md:mb-6 text-xs md:text-sm">
              OPTIONAL
            </h3>
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b w-full border-gray-100 pb-4 md:pb-6 gap-4 md:gap-0">
              <p className="text-gray-800 text-sm md:text-base max-w-3xl">{optionalQuestion.id}. {optionalQuestion.text}</p>
              <div className="flex gap-3 w-1/2 lg:w-full justify-end">
                <button
                  onClick={() => handleAnswer(optionalQuestion.id, true)}
                  className={`flex-1 md:flex-none px-6 py-2 rounded border transition-colors ${answers[optionalQuestion.id] === true
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[#EDF3FF] text-gray-600 border-[#1865FF4D] hover:bg-gray-50'
                    }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(optionalQuestion.id, false)}
                  className={`flex-1 md:flex-none px-6 py-2 rounded border transition-colors ${answers[optionalQuestion.id] === false
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[#EDF3FF] text-gray-600 border-[#1865FF4D] hover:bg-gray-50'
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-full md:w-auto bg-[#0D25FF] hover:bg-[#0D25FF]/80 text-white font-bold py-3 md:py-4 px-8 md:px-24 rounded-lg text-base md:text-lg transition-colors shadow-lg shadow-[#0D25FF]/20"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <TestPageContent />
    </Suspense>
  );
}
