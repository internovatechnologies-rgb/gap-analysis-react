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
  impactTags: ('audit_risk' | 'financial' | 'time_effort')[];
}

const questionFeedback: Record<number, QuestionFeedback> = {
  // Domain 1: Documentation
  1: {
    strengthText: "You have a full, current policy set for all service lines.",
    weaknessText: "Some service lines are missing policies or still use outdated versions.",
    impactTags: ["audit_risk", "financial"],
  },
  2: {
    strengthText: "Your policies have been reviewed and updated within the past 12 months.",
    weaknessText: "Many policies have not been reviewed or updated in over 12 months.",
    impactTags: ["audit_risk", "financial"],
  },
  3: {
    strengthText: "You track policy versions clearly, with dates and history.",
    weaknessText: "Policy versions are not tracked in a formal, consistent way.",
    impactTags: ["audit_risk", "time_effort"],
  },
  4: {
    strengthText: "Staff acknowledgements provide proof that policies are communicated and understood.",
    weaknessText: "Staff acknowledgements are not consistently recorded when policies change.",
    impactTags: ["audit_risk", "time_effort"],
  },
  // Domain 2: Regulatory Tracking
  5: {
    strengthText: "Someone routinely monitors state-level regulatory changes that affect your programs.",
    weaknessText: "State-level regulatory changes may not be tracked or reviewed regularly.",
    impactTags: ["audit_risk", "financial"],
  },
  6: {
    strengthText: "You have a defined process to implement new regulations within 30 days.",
    weaknessText: "There is no clear, time-bound process to implement new regulations.",
    impactTags: ["audit_risk", "time_effort"],
  },
  7: {
    strengthText: "You have had no findings or citations in the past 24 months.",
    weaknessText: "Recent findings or citations point to areas that still need monitoring.",
    impactTags: ["audit_risk", "financial"],
  },
  8: {
    strengthText: "You maintain a written log of regulatory updates and how your programs responded.",
    weaknessText: "Regulatory updates and your responses are not tracked in a single, written log.",
    impactTags: ["audit_risk", "time_effort"],
  },
  // Domain 3: Operational Processes
  9: {
    strengthText: "Required annual trainings are consistently completed and documented.",
    weaknessText: "Some staff are missing required annual trainings or documentation is incomplete.",
    impactTags: ["audit_risk", "financial"],
  },
  10: {
    strengthText: "Incidents and corrective actions are documented in a consistent format.",
    weaknessText: "Incident and corrective action documentation is incomplete or not stored centrally.",
    impactTags: ["audit_risk", "financial", "time_effort"],
  },
  11: {
    strengthText: "You conduct a structured internal audit or review at least once a year.",
    weaknessText: "There is no routine internal audit or review cycle.",
    impactTags: ["audit_risk", "financial"],
  },
  12: {
    strengthText: "You follow a documented schedule to review incidents, trends, and corrective actions.",
    weaknessText: "There is no clear schedule for reviewing incidents, trends, and corrective actions.",
    impactTags: ["audit_risk", "time_effort", "financial"],
  },
  // Domain 4: Accreditation Readiness
  13: {
    strengthText: "Policies are intentionally aligned with your current accrediting standards.",
    weaknessText: "Policy language has not been mapped directly to current accrediting standards.",
    impactTags: ["audit_risk", "financial"],
  },
  14: {
    strengthText: "You can retrieve required documents within 24 hours when requested.",
    weaknessText: "Retrieving required documents within 24 hours would be difficult or highly manual.",
    impactTags: ["audit_risk", "time_effort"],
  },
  15: {
    strengthText: "Your last review or mock assessment did not identify significant gaps.",
    weaknessText: "Recent reviews identified gaps that may still need follow-up.",
    impactTags: ["audit_risk", "financial"],
  },
  16: {
    strengthText: "Compliance documents are stored in a central, organized repository.",
    weaknessText: "Compliance documents are stored in multiple locations and are hard to retrieve quickly.",
    impactTags: ["audit_risk", "time_effort"],
  },
  // Optional Question
  17: {
    strengthText: "Client rights, privacy, and emergency handbooks are current and consistent with your policies.",
    weaknessText: "Client rights, privacy, and emergency handbooks may be outdated or inconsistent with your policies.",
    impactTags: [],
  },
};

// Impact risk level types
type ImpactRiskLevel = 'Low' | 'Moderate' | 'High';

// Calculate impact scores from answers
const calculateImpactScores = (answers: Record<number, boolean | null>) => {
  let auditRisk = 0;
  let financial = 0;
  let timeEffort = 0;

  // Only count questions 1-16 (not optional Q17)
  for (let id = 1; id <= 16; id++) {
    if (answers[id] === true) {
      const feedback = questionFeedback[id];
      if (feedback) {
        if (feedback.impactTags.includes('audit_risk')) auditRisk++;
        if (feedback.impactTags.includes('financial')) financial++;
        if (feedback.impactTags.includes('time_effort')) timeEffort++;
      }
    }
  }

  return { auditRisk, financial, timeEffort };
};

// Get risk level for each impact category
const getAuditRiskLevel = (score: number): ImpactRiskLevel => {
  if (score >= 13) return 'Low';
  if (score >= 10) return 'Moderate';
  return 'High';
};

const getFinancialRiskLevel = (score: number): ImpactRiskLevel => {
  if (score >= 8) return 'Low';
  if (score >= 6) return 'Moderate';
  return 'High';
};

const getTimeEffortRiskLevel = (score: number): ImpactRiskLevel => {
  if (score >= 7) return 'Low';
  if (score >= 5) return 'Moderate';
  return 'High';
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

  // Calculate impact scores
  const impactScores = calculateImpactScores(answers);
  const impactLevels = {
    auditRisk: getAuditRiskLevel(impactScores.auditRisk),
    financial: getFinancialRiskLevel(impactScores.financial),
    timeEffort: getTimeEffortRiskLevel(impactScores.timeEffort),
  };

  // Determine Risk Tier
  let riskTier = 'High Risk';
  let riskColor = 'text-red-600';
  let bg = '#FF0000';
  let riskBg = 'bg-red-50';
  let message = "Your document needs to be analyzed!";
  let detailedMessage = "Immediate attention is required. Significant gaps put your accreditation at risk.";

  if (score >= 12) {
    riskTier = 'Low Risk';
    riskColor = 'text-green-600';
    bg = 'bg-[#46BB66]';
    riskBg = 'bg-green-50';
    message = "Congratulations!";
    detailedMessage = "You're in a good place. Your answers show strong compliance practices with only a few areas to tighten.";
  } else if (score >= 7) {
    riskTier = 'Moderate Risk';
    riskColor = 'text-orange-600';
    bg = 'bg-[#ED933F]';
    riskBg = 'bg-[#FFF2E5]';
    message = "Gaps detected. Your risk is moderate.";
    detailedMessage = "You have a foundation, but gaps exist. Your answers show potential blind spots.";
  }

  // Domain Impact and Action based on score (deal-breaker aware)
  const domainImpactAction: Record<string, Record<number, { impact: string; action: string }>> = {
    documentation: {
      0: {
        impact: "Core documentation is missing or unusably outdated. This is a baseline compliance failure and almost always leads to immediate findings and staff confusion.",
        action: "Start a full documentation rebuild, beginning with core policies for each service line and bringing them up to current standards before addressing secondary controls."
      },
      1: {
        impact: "Core documentation is missing or unusably outdated. This is a baseline compliance failure and almost always leads to immediate findings and staff confusion.",
        action: "Start a full documentation rebuild, beginning with core policies for each service line and bringing them up to current standards before addressing secondary controls."
      },
      2: {
        impact: "Some key policies exist, but missing service lines, outdated content, or lack of acknowledgement still expose you to citations during routine reviews.",
        action: "Complete the missing policies first, then add simple review, version control, and staff acknowledgement steps to stabilise the system."
      },
      3: {
        impact: "Most documentation is in good shape, but at least one critical documentation requirement is missing. Auditors often treat this as a finding regardless of other strengths.",
        action: "Fix the critical gap first, then standardise how policies are reviewed, versioned, and communicated so the system holds up under scrutiny."
      },
      4: {
        impact: "Policies are complete, current, and well controlled, providing a strong foundation for all other compliance work.",
        action: "Maintain this level by running occasional sample policy reviews to confirm documents still reflect day-to-day practice."
      }
    },
    regulatoryTracking: {
      0: {
        impact: "There is no reliable way to track or implement regulatory changes. This is a direct licensing and accreditation risk and frequently leads to repeat findings.",
        action: "Assign clear ownership and establish a basic, documented routine for monitoring state updates and logging required changes."
      },
      1: {
        impact: "There is no reliable way to track or implement regulatory changes. This is a direct licensing and accreditation risk and frequently leads to repeat findings.",
        action: "Assign clear ownership and establish a basic, documented routine for monitoring state updates and logging required changes."
      },
      2: {
        impact: "Some regulatory changes are noticed, but gaps in tracking or implementation mean requirements can be missed without warning.",
        action: "Create a simple workflow that records each update, assigns responsibility, and confirms implementation within a defined timeframe."
      },
      3: {
        impact: "Most regulatory changes are handled, but a missing log or recent citation signals elevated risk. Auditors often focus on these gaps even when other controls are strong.",
        action: "Formalise your tracking process and centralise the regulatory log so you can clearly show how changes are identified and acted on."
      },
      4: {
        impact: "Regulatory changes are consistently monitored, documented, and implemented, showing strong alignment with current rules.",
        action: "Keep the log current and review it before surveys to demonstrate a clear history of staying compliant."
      }
    },
    operationalProcesses: {
      0: {
        impact: "Trainings, incidents, or corrective actions are missing or undocumented. Auditors view this as a serious safety and quality concern.",
        action: "Put a basic structure in place immediately to track mandatory trainings, incident reports, and follow-up actions in one location."
      },
      1: {
        impact: "Trainings, incidents, or corrective actions are missing or undocumented. Auditors view this as a serious safety and quality concern.",
        action: "Put a basic structure in place immediately to track mandatory trainings, incident reports, and follow-up actions in one location."
      },
      2: {
        impact: "Operational activities are happening, but inconsistent documentation weakens your ability to prove safe and reliable practice.",
        action: "Standardise how trainings and incidents are recorded and ensure every event has documented follow-up."
      },
      3: {
        impact: "Operations generally support safe practice, but a missing training record or incident trail can outweigh other strengths during audits.",
        action: "Close the critical gaps first, then lock in a recurring review routine to keep documentation consistent over time."
      },
      4: {
        impact: "Trainings, incidents, corrective actions, and reviews are consistently managed, giving strong evidence of a well-run service.",
        action: "Use this data to show trends and improvement over time, especially when preparing for surveys."
      }
    },
    accreditationReadiness: {
      0: {
        impact: "Documents are scattered, standards are not clearly mapped, or past gaps remain unresolved. This creates a high likelihood of survey findings.",
        action: "Centralise core accreditation documents and map each one to the relevant standards as your first priority."
      },
      1: {
        impact: "Documents are scattered, standards are not clearly mapped, or past gaps remain unresolved. This creates a high likelihood of survey findings.",
        action: "Centralise core accreditation documents and map each one to the relevant standards as your first priority."
      },
      2: {
        impact: "You can show some evidence, but slow retrieval or unclear follow-up increases stress and the risk of repeat findings.",
        action: "Organise documents into a single structure and document how past gaps were addressed."
      },
      3: {
        impact: "You are mostly survey-ready, but a single unresolved gap or retrieval issue can still trigger findings despite overall preparedness.",
        action: "Run a mock document pull and tighten any weak points before your next external review."
      },
      4: {
        impact: "Policies align to standards, documents are easy to retrieve, and past gaps are addressed, giving you a confident survey posture.",
        action: "Maintain a short readiness checklist and review it before each external visit to preserve this level of performance."
      }
    }
  };

  // Domain Detail View
  if (selectedDomain) {
    const domainLevel = domainLevels[selectedDomain as keyof typeof domainLevels];
    const domainQuestionIds = domainQuestions[selectedDomain as keyof typeof domainQuestions];
    const domainContent = getDomainDetailFromAnswers(domainQuestionIds, answers);
    const domainScore = domainScores[selectedDomain as keyof typeof domainScores];
    const impactActionData = domainImpactAction[selectedDomain]?.[domainScore];

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

            {/* Strengths - only show if there are strengths */}
            {domainContent.strengths.length > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-4">
                <h3 className="text-green-700 font-bold mb-4">Strengths</h3>
                <ul className="space-y-3">
                  {domainContent.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses - only show if there are weaknesses */}
            {domainContent.weaknesses.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-4">
                <h3 className="text-red-700 font-bold mb-4">Weaknesses</h3>
                <ul className="space-y-3">
                  {domainContent.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Impact & Action Section */}
            {impactActionData && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                <h3 className="text-blue-700 font-bold mb-4">Impact & Action</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Impact</h4>
                    <p className="text-sm text-gray-700">{impactActionData.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Action</h4>
                    <p className="text-sm text-gray-700">{impactActionData.action}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600 mb-6">
                Schedule a call with us today and find out how your policy update timelines go from weeks to just a few days.
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
              Status:{score}/17
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
              <h3 className="text-blue-700 font-bold mb-4">Impact Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">Audit and Accreditation Risk - </span>


                  <span className={`ml-1 text-sm text-gray-700`}>
                    {impactLevels.auditRisk}
                  </span>

                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">Staff Time and Effort - </span>{""}
                  <span className={`ml-1 text-sm text-gray-700`}>
                    {impactLevels.timeEffort}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">Financial Exposure - </span>

                  <span className={`ml-1 text-sm text-gray-700`}>
                    {impactLevels.financial}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-base text-gray-600 mb-6">
                Schedule a call with us today and find out how your policy update timelines go from weeks to just a few days.
              </p>
              <p className="text-sm text-gray-500 italic mb-6">
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
