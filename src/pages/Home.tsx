import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="h-full w-full bg-white flex items-center justify-center px-4 py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center lg:items-stretch">
        {/* Illustration - Left side on desktop, top on mobile */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center">
          <div className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] aspect-square">
            <img
              src="/rectangle_frame.png"
              alt="Compliance Icon"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content - Right side on desktop, bottom on mobile */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Welcome to the Theraptly Gap Analyzer!
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-xl leading-relaxed">
            Answer a few quick questions and get an instant breakdown of your strengths, weaknesses, and next steps.
          </p>

          {/* Feature List */}
          <div className="mb-6 md:mb-8 space-y-3 w-full max-w-xl">
            <div className="flex items-start gap-3 text-left">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Instant risk and strength assessment.
              </p>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Clear identification of critical gaps.
              </p>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Actionable guidance to fix policies quickly.
              </p>
            </div>
          </div>

          <Link to="/test" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#0D25FF] hover:bg-[#0D25FF]/90 text-white font-semibold py-3 px-12 sm:px-16 md:px-20 lg:px-24 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-base sm:text-lg">
              Start test
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
