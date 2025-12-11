import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ResultViewProps {
  score: number;
  answers: Record<number, boolean | null>;
}

// Domain scoring: 0-2 = weak, 3 = moderate, 4 = strong
type ScoreLevel = 'weak' | 'moderate' | 'strong';

interface DomainFeedback {
  title: string;
  weak: string;
  moderate: string;
  strong: string;
}

interface DomainDetailContent {
  strengths: string[];
  weaknesses: string[];
}

// Question-based feedback for each question
interface QuestionFeedback {
  strengthText: string;
  weaknessText: string;
}

const questionFeedback: Record<number, QuestionFeedback> = {
  // Domain 1: Documentation
  1: {
    strengthText: "You have a full, current policy set for all service lines.",
    weaknessText: "Some service lines are missing policies or still use outdated versions.",
  },
  2: {
    strengthText: "Your policies have been reviewed and updated within the past 12 months.",
    weaknessText: "Many policies have not been reviewed or updated in over 12 months.",
  },
  3: {
    strengthText: "You track policy versions clearly, with dates and history.",
    weaknessText: "Policy versions are not tracked in a formal, consistent way.",
  },
  4: {
    strengthText: "Staff acknowledgements provide proof that policies are communicated and understood.",
    weaknessText: "Staff acknowledgements are not consistently recorded when policies change.",
  },
  // Domain 2: Regulatory Tracking
  5: {
    strengthText: "Someone routinely monitors state-level regulatory changes that affect your programs.",
    weaknessText: "State-level regulatory changes may not be tracked or reviewed regularly.",
  },
  6: {
    strengthText: "You have a defined process to implement new regulations within 30 days.",
    weaknessText: "There is no clear, time-bound process to implement new regulations.",
  },
  7: {
    strengthText: "You have had no findings or citations in the past 24 months.",
    weaknessText: "Recent findings or citations point to areas that still need monitoring.",
  },
  8: {
    strengthText: "You maintain a written log of regulatory updates and how your programs responded.",
    weaknessText: "Regulatory updates and your responses are not tracked in a single, written log.",
  },
  // Domain 3: Operational Processes
  9: {
    strengthText: "Required annual trainings are consistently completed and documented.",
    weaknessText: "Some staff are missing required annual trainings or documentation is incomplete.",
  },
  10: {
    strengthText: "Incidents and corrective actions are documented in a consistent format.",
    weaknessText: "Incident and corrective action documentation is incomplete or not stored centrally.",
  },
  11: {
    strengthText: "You conduct a structured internal audit or review at least once a year.",
    weaknessText: "There is no routine internal audit or review cycle.",
  },
  12: {
    strengthText: "You follow a documented schedule to review incidents, trends, and corrective actions.",
    weaknessText: "There is no clear schedule for reviewing incidents, trends, and corrective actions.",
  },
  // Domain 4: Accreditation Readiness
  13: {
    strengthText: "Policies are intentionally aligned with your current accrediting standards.",
    weaknessText: "Policy language has not been mapped directly to current accrediting standards.",
  },
  14: {
    strengthText: "You can retrieve required documents within 24 hours when requested.",
    weaknessText: "Retrieving required documents within 24 hours would be difficult or highly manual.",
  },
  15: {
    strengthText: "Your last review or mock assessment did not identify significant gaps.",
    weaknessText: "Recent reviews identified gaps that may still need follow-up.",
  },
  16: {
    strengthText: "Compliance documents are stored in a central, organized repository.",
    weaknessText: "Compliance documents are stored in multiple locations and are hard to retrieve quickly.",
  },
  // Optional Question
  17: {
    strengthText: "Client rights, privacy, and emergency handbooks are current and consistent with your policies.",
    weaknessText: "Client rights, privacy, and emergency handbooks may be outdated or inconsistent with your policies.",
  },
};

const domainFeedback: Record<string, DomainFeedback> = {
  documentation: {
    title: 'Documentation',
    weak: "Your core policies are missing, outdated, or hard to manage. Surveyors are likely to find basic documentation gaps.",
    moderate: "Most key policies exist, but reviews, version control, or staff acknowledgements are inconsistent and need tightening.",
    strong: "Your policies are complete, current, and well managed, giving you a solid foundation for any audit or review.",
  },
  regulatoryTracking: {
    title: 'Regulatory Tracking',
    weak: "There is little or no reliable process for tracking and implementing regulatory changes, which increases accreditation and licensing risk.",
    moderate: "You notice and respond to some regulatory changes, but the process is uneven and can lead to last minute updates before surveys.",
    strong: "Regulatory changes are monitored, documented, and implemented through a clear process, showing you stay aligned with current rules.",
  },
  operationalProcesses: {
    title: 'Operational Processes',
    weak: "Trainings, incidents, and internal reviews are poorly documented or not done routinely, which raises questions about safety and quality.",
    moderate: "Many operational tasks are happening, but documentation and follow through are inconsistent and create extra work before audits.",
    strong: "Trainings, incidents, corrective actions, and reviews are consistently handled and documented, giving you strong evidence of safe, well run services.",
  },
  accreditationReadiness: {
    title: 'Accreditation Readiness',
    weak: "You may struggle to show surveyors what they ask for because documents are scattered, gaps from past reviews may be unresolved, or standards are not clearly mapped.",
    moderate: "You can meet some survey expectations, but document retrieval, standard alignment, or follow up on past gaps is unreliable and stressful.",
    strong: "Policies are mapped to standards, key documents are easy to retrieve, and past gaps are addressed, putting you in a confident, survey ready position.",
  },
};

// Domain question mappings
const domainQuestions = {
  documentation: [1, 2, 3, 4],
  regulatoryTracking: [5, 6, 7, 8],
  operationalProcesses: [9, 10, 11, 12],
  accreditationReadiness: [13, 14, 15, 16],
};

const getScoreLevel = (score: number, totalQuestions: number): ScoreLevel => {
  // Scoring: 0-2 weak, 3 moderate, 4 strong (for 4 questions)
  if (totalQuestions === 4) {
    if (score <= 2) return 'weak';
    if (score === 3) return 'moderate';
    return 'strong';
  }
  return 'weak';
};

// Helper function to get strengths and weaknesses based on actual answers
const getDomainDetailFromAnswers = (
  questionIds: number[],
  answers: Record<number, boolean | null>
): DomainDetailContent => {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  questionIds.forEach((id) => {
    const feedback = questionFeedback[id];
    if (feedback) {
      if (answers[id] === true) {
        strengths.push(feedback.strengthText);
      } else {
        weaknesses.push(feedback.weaknessText);
      }
    }
  });

  return { strengths, weaknesses };
};

const ResultView = ({ score, answers }: ResultViewProps) => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Redirect to home if score is zero
  useEffect(() => {
    if (score === 0) {
      navigate('/');
    }
  }, [score, navigate]);

  // Calculate domain scores
  const calculateDomainScore = (questionIds: number[]): number => {
    return questionIds.reduce((acc, id) => {
      return acc + (answers[id] === true ? 1 : 0);
    }, 0);
  };

  const domainScores = {
    documentation: calculateDomainScore(domainQuestions.documentation),
    regulatoryTracking: calculateDomainScore(domainQuestions.regulatoryTracking),
    operationalProcesses: calculateDomainScore(domainQuestions.operationalProcesses),
    accreditationReadiness: calculateDomainScore(domainQuestions.accreditationReadiness),
  };

  const domainLevels = {
    documentation: getScoreLevel(domainScores.documentation, domainQuestions.documentation.length),
    regulatoryTracking: getScoreLevel(domainScores.regulatoryTracking, domainQuestions.regulatoryTracking.length),
    operationalProcesses: getScoreLevel(domainScores.operationalProcesses, domainQuestions.operationalProcesses.length),
    accreditationReadiness: getScoreLevel(domainScores.accreditationReadiness, domainQuestions.accreditationReadiness.length),
  };
  // Determine Risk Tier
  let riskTier = 'High Risk';
  let riskDescription = 'Significant vulnerabilities, recommend urgent remediation';
  let riskColor = 'text-red-600';
  let bg = '#FF0000';
  let riskBg = 'bg-red-50';
  let borderColor = 'border-red-200';
  let iconColor = 'bg-red-500';
  let message = "Your document needs to be analyzed!";
  let detailedMessage = "Immediate attention is required. Significant gaps put your accreditation at risk.";
  let themeColor = 'red';

  if (score >= 12) {
    riskTier = 'Low Risk';
    riskDescription = 'Strong documentation and processes';
    riskColor = 'text-green-600';
    bg = 'bg-[#46BB66]';
    riskBg = 'bg-green-50';
    borderColor = 'border-green-200';
    iconColor = 'bg-green-500';
    message = "Congratulations! Your score is " + score;
    detailedMessage = "You're in a good place. Your answers show strong compliance practices with only a few areas to tighten.";
    themeColor = 'green';
  } else if (score >= 7) {
    riskTier = 'Moderate Risk';
    riskDescription = 'Gaps that need attention within 60 days';
    riskColor = 'text-orange-600';
    bg = 'bg-[#ED933F]';
    riskBg = 'bg-[#FFF2E5]';
    borderColor = 'border-orange-200';
    iconColor = 'bg-orange-500';
    message = "Gaps detected. Your risk is moderate.";
    detailedMessage = "You have a foundation, but gaps exist. Your answers show potential blind spots.";
    themeColor = 'orange';
  }

  // Content Configuration
  const content = {
    'Low Risk': {
      strengths: [
        "You don’t panic. When an auditor asks for a document, you know exactly where it is (Q14) and can produce it instantly (Q12).",
        "Your team is in the loop.You aren’t just writing rules; your staff actually signs off on them(Q4), protecting you from liability."
      ],
      weaknesses: [
        "Your system likely depends heavily on one superstar compliance lead (Q6). If they leave, does the system fall apart?",
        "Keeping 100 % of policies updated annually(Q2) requires massive manual effort.You are safe, but you are likely inefficient."
      ],
      impacts: [
        "Market Advantage: Your facility is positioned as a trusted leader. By maintaining this level of readiness, you minimize audit preparation time and eliminate the risk of 'clawbacks' (paying back money to insurers)."
      ]
    },
    'Moderate Risk': {
      strengths: [
        "You're operationally sound. Your doors are open and staff are trained (Q8). You handle incidents well when they happen (Q9).",
        "You have a starting point. You aren't starting from zero; you have a handbook and core policies (Q1), even if they are a bit dusty."
      ],
      weaknesses: [
        "You might tell staff about changes, but without formal sign-offs (Q4), you can't prove it in court.",
        "Without a central repository (Q14), retrieving documents takes days, not hours. This makes auditors suspicious immediately.",
        "You have policies, but if they haven't been updated in 12+ months (Q2), you are technically out of compliance with current standards."
      ],
      impacts: [
        "You are walking a fine line. While you may not fail outright, you are at high risk for Conditional Accreditation, which limits your growth and triggers mandatory follow-up surveys. Small gaps now often turn into costly delays during reaccreditation."
      ]
    },
    'High Risk': {
      strengths: [
        "You are focused entirely on client care. Your 'Incident Reporting' (Q9) is likely the only compliance muscle you exercise regularly."
      ],
      weaknesses: [
        "You are guessing. Without a compliance officer (Q5) or state monitoring (Q5), you don't actually know what the current rules are.",
        "Zero Defense. If a claim is challenged, you have no updated policies (Q2) or staff acknowledgments (Q4) to defend your billing.",
        "You admitted you can't produce docs within 24 hours (Q12). In an audit, hesitation equals failure."
      ],
      impacts: [
        "Your license and revenue are exposed. Operating at this level invites financial recoupment (paying back billed claims), immediate citations, and potential revocation of your accreditation. One surprise inspection could shut down your admissions."
      ]
    }
  };

  const currentContent = content[riskTier as keyof typeof content];

  // Domain Detail View
  if (selectedDomain) {
    const domainLevel = domainLevels[selectedDomain as keyof typeof domainLevels];
    const domainInfo = domainFeedback[selectedDomain as keyof typeof domainFeedback];
    const domainQuestionIds = domainQuestions[selectedDomain as keyof typeof domainQuestions];
    const domainContent = getDomainDetailFromAnswers(domainQuestionIds, answers);

    const levelColors = {
      weak: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-700',
        headerBg: 'bg-red-500',
      },
      moderate: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-700',
        headerBg: 'bg-orange-500',
      },
      strong: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        badge: 'bg-green-100 text-green-700',
        headerBg: 'bg-green-500',
      },
    };
    const colors = levelColors[domainLevel];

    return (
      <div className="w-full mx-auto pb-16">
        <div className={`${colors.headerBg} overflow-hidden`}>
          <div className="mt-12 bg-white rounded-t-3xl py-12 px-4 xl:px-34">
            {/* Back Button */}
            <button
              onClick={() => setSelectedDomain(null)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Results
            </button>

            {/* Strengths */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-4">
              <h3 className="text-green-700 font-bold mb-4">Strengths</h3>
              {domainContent.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {domainContent.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No strengths identified in this domain based on your answers.</p>
              )}
            </div>

            {/* Weaknesses */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
              <h3 className="text-red-700 font-bold mb-4">Weaknesses</h3>
              {domainContent.weaknesses.length > 0 ? (
                <ul className="space-y-3">
                  {domainContent.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No weaknesses identified in this domain based on your answers.</p>
              )}
            </div>

            {/* Next Steps */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600 mb-6">
                We'd also love to hop on a quick call and show you exactly how to tighten your policies for CARF and DBH compliance.
              </p>
              <p className="text-xs text-gray-500 italic mb-6">
                Click on our Calendly link and let us know a convenient time for you. Looking forward to helping you get audit-ready!
              </p>

              <div className="flex flex-col lg:flex-row gap-4">
                <a
                  href="https://calendly.com/tobi-walker-theraptly/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule a call
                </a>
                <a href="https://theraptly.com" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg text-center transition-colors">
                  Analyze your Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full mx-auto pb-16`}>
      {/* Main Card */}
      <div className={`${bg} overflow-hidden ${score >= 12 ? 'border-green-500' : score >= 7 ? 'border-orange-500' : 'border-red-500'}`}>
        <div className='mt-12 bg-white rounded-t-3xl py-12 px-4 xl:px-34 flex flex-col xl:gap-16 md:flex-row items-start justify-center'>
          {/* Score Tier Badge */}
          <div className={`flex w-full flex-col items-center gap-1 px-6 py-3 rounded-xl ${riskBg} ${riskColor} font-bold text-lg mb-6`}>
            <h2 className='text-black text-sm text-center'>Score Tier:</h2>
            <div className='inline-flex items-center gap-1'>
              {score >= 12 && (
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</div>
              )}
              {score >= 7 && score < 12 && (
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-serif">i</div>
              )}
              {score < 7 && (
                <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-serif">!</div>
              )}
              {riskTier}


            </div>
            <span className={`text-sm font-semibold rounded-full w-fit`}>
              Status:{score}/16
            </span>
            {/* Illustration Placeholder */}
            <img
              src="/chart.png"
              alt="Theraptly Logo"
              className="w-full h-full"
            />
          </div>
          {/* </div> */}

          {/* Content Boxes */}
          <div className=" pb-12 space-y-2">

            <h2 className="text-3xl font-bold text-gray-900 mb-4">{message}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {detailedMessage}
            </p>

            {/* Domain Feedback Grid */}
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(domainLevels).map(([domainKey, level]) => {
                  const feedback = domainFeedback[domainKey as keyof typeof domainFeedback];
                  const levelColors = {
                    weak: {
                      bg: 'bg-red-50',
                      border: 'border-red-200',
                      badge: 'text-red-700',
                      icon: 'text-red-500',
                    },
                    moderate: {
                      bg: 'bg-orange-50',
                      border: 'border-orange-200',
                      badge: 'text-orange-700',
                      icon: 'text-orange-500',
                    },
                    strong: {
                      bg: 'bg-green-50',
                      border: 'border-green-200',
                      badge: 'text-green-700',
                      icon: 'text-green-500',
                    },
                  };
                  const colors = levelColors[level];

                  return (
                    <div
                      key={domainKey}
                      className={`${colors.bg} border ${colors.border} rounded-xl p-5`}
                    >
                      <div className="flex items-start gap-2">
                        <div className='inline-flex items-center gap-1'>
                          {level === "strong" && (
                            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</div>
                          )}
                          {level === "moderate" && (
                            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-serif">i</div>
                          )}
                          {level === "weak" && (
                            <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-serif">!</div>
                          )}
                        </div>
                        <div className="flex flex-col mb-3">
                          <h4 className="font-semibold text-lg text-gray-900">{feedback.title}</h4>
                          <span className={`text-base font-semibold rounded-full w-fit ${colors.badge}`}>
                            Status:{level}
                          </span>

                          <p className="text-sm mt-2 text-gray-700 leading-relaxed">
                            {feedback[level]}
                          </p>
                          <button
                            onClick={() => setSelectedDomain(domainKey)}
                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold cursor-pointer text-black transition-colors"
                          >
                            View Details
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>


                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-[#F2F2F2] rounded-xl p-6">
              <h3 className="text-blue-700 font-bold mb-4">Impacts</h3>
              <ul className="space-y-3">
                {currentContent.impacts.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600 mb-6">
                We'd also love to hop on a quick call and show you exactly how to tighten your policies for CARF and DBH compliance.
              </p>
              <p className="text-xs text-gray-500 italic mb-6">
                Click on our Calendly link and let us know a convenient time for you. Looking forward to helping you get audit-ready!
              </p>

              <div className="flex flex-col lg:flex-row gap-4">
                <a
                  href="https://calendly.com/tobi-walker-theraptly/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule a call
                </a>
                <a href="https://theraptly.com" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg text-center transition-colors">
                  Analyze your Policy
                </a>
              </div>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
};

export default ResultView;
