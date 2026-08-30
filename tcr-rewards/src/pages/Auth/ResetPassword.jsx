// src/pages/Auth/ResetPassword.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mocking email send
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 bg-sbGreen rounded-full flex items-center justify-center text-white mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Reset email sent!</h2>
        <p className="text-gray-500 text-lg mb-10 max-w-sm">
          If an account exists for {email}, you will receive an email with instructions to reset your password shortly.
        </p>
        <button onClick={() => navigate('/login')} className="sb-btn-primary py-4 px-12 text-lg">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      <div className="w-full max-w-lg">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sbDark font-bold mb-8 hover:text-sbGreen transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <h1 className="text-3xl font-bold mb-4 text-sbDark">Reset your password</h1>
        <p className="text-gray-500 mb-12">Enter the email address associated with your account and we'll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="email"
              required
              className="sb-input"
              placeholder="* Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="sb-btn-black py-5 rounded-full text-xl shadow-xl w-full md:w-fit md:px-12"
          >
            {isSubmitting ? (
              <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full block mx-auto"></span>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
