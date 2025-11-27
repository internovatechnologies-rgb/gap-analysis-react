import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="h-full w-full bg-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <img
            src="/compliance.png"
            alt="Compliance Icon"
            width={128}
            height={128}
            className="w-32 h-32"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Check your compliance risk in 3 minutes.
        </h1>

        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Answer a few quick questions and get an instant breakdown of your strengths, weaknesses, and next steps.
        </p>

        <Link to="/test">
          <button className="bg-[#0D25FF] hover:bg-[#0D25FF]/80 text-white font-semibold py-3 px-24 rounded-lg transition-colors duration-200">
            Start test
          </button>
        </Link>
      </div>
    </div>
  );
}
