

interface ResultViewProps {
  score: number;
  answers: Record<number, boolean | null>;
}

const ResultView = ({ score, answers }: ResultViewProps) => {
  // Determine Risk Tier
  let riskTier = 'High Risk';
  let riskColor = 'text-red-600';
  let riskBg = 'bg-red-50';
  let iconColor = 'bg-red-500';
  let message = "You Passed, your score is (" + score + "). Your document needs to be analyzed!";

  if (score >= 12) {
    riskTier = 'Low Risk';
    riskColor = 'text-green-600';
    riskBg = 'bg-green-50';
    iconColor = 'bg-green-500';
    message = "Congratulations! You Passed, your score is (" + score + ").";
  } else if (score >= 7) {
    riskTier = 'Moderate Risk';
    riskColor = 'text-orange-600';
    riskBg = 'bg-orange-50';
    iconColor = 'bg-orange-500';
    message = "You Passed, your score is (" + score + "). Your document needs to be analyzed!";
  }

  // Generate Recommendations (Simplified Logic)
  const strengths = [];
  const weaknesses = [];

  // Example mapping - in a real app this would be more comprehensive
  if (answers[1]) strengths.push("Policies are complete and current.");
  else weaknesses.push("Policies may be incomplete or outdated.");

  if (answers[2]) strengths.push("Policies updated in last 12 months.");
  else weaknesses.push("Policies need review (not updated in 12 months).");

  if (answers[5]) strengths.push("Monitoring state-level changes.");
  else weaknesses.push("Not monitoring state-level changes.");

  if (answers[8]) strengths.push("Staff complete annual trainings.");
  else weaknesses.push("Staff training gaps identified.");

  // Fill with generic if empty to match design
  if (strengths.length === 0) strengths.push("No specific strengths identified based on answers.");
  if (weaknesses.length === 0) weaknesses.push("No specific weaknesses identified based on answers.");

  return (
    <div className={`w-full max-w-5xl pt-12 mx-auto ${score >= 12 ? 'bg-green-500' : 'bg-red-500'}`}>
      <div className={`rounded-t-3xl bg-white mt-8 p-6 md:p-12  text-white relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <circle cx="0" cy="0" r="400" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Score Card */}
          <div className="bg-white w-full md:w-1/3 flex flex-col items-center text-center">
            <div className={`text-sm uppercase tracking-wider font-bold mb-2 ${riskColor === 'text-green-600' ? 'text-gray-500' : 'text-gray-500'}`}>Score Tier:</div>
            <div className={`text-2xl font-bold mb-6 flex items-center gap-2 ${riskColor}`}>
              <div className={`w-6 h-6 rounded-full ${iconColor} text-white flex items-center justify-center text-xs`}>
                {score >= 12 ? '✓' : '!'}
              </div>
              {riskTier}
            </div>

            {/* Illustration */}
            <div className={`w-full aspect-square ${riskBg} rounded-xl mb-4 flex items-center justify-center`}>
              <div className="w-24 h-32 bg-white shadow-sm rounded border border-gray-100 flex flex-col gap-2 p-3">
                <div className={`h-3 w-full ${score >= 12 ? 'bg-green-600' : 'bg-red-600'} rounded-sm`}></div>
                <div className="h-1 w-3/4 bg-gray-200 rounded-sm"></div>
                <div className="h-1 w-full bg-gray-200 rounded-sm"></div>
                <div className="h-1 w-5/6 bg-gray-200 rounded-sm"></div>
                <div className="h-1 w-full bg-gray-200 rounded-sm mt-2"></div>
                <div className="h-1 w-2/3 bg-gray-200 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className=" mt-3 p-4 w-full md:w-2/3 text-gray-800">
            <h2 className="text-2xl font-bold mb-2">{message}</h2>
            <p className="text-gray-600 mb-8">
              {score >= 12
                ? "You're in a good place. Your answers show strong compliance practices with only a few areas to tighten. You'll see the small gaps to fix so you stay fully audit-ready."
                : "Your answers indicate some significant gaps in your compliance documentation and processes. We recommend immediate action to address these vulnerabilities."}
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h3 className="text-green-700 font-bold mb-2 text-sm uppercase">Strengths</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {strengths.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
                <p className="text-xs text-gray-400 mt-2 italic">Analyze a policy to see how these strengths reflect in your documentation.</p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <h3 className="text-red-700 font-bold mb-2 text-sm uppercase">Weaknesses</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {weaknesses.slice(0, 3).map((w, i) => <li key={i}>{w}</li>)}
                </ul>
                <p className="text-xs text-gray-400 mt-2 italic">Analyze a policy to see how these strengths reflect in your documentation.</p>
              </div>
            </div>

            <a
              href="https://calendly.com/tobi-walker-theraptly/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors text-center"
            >
              Analyze your Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
