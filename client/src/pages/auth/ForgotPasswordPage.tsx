import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Simulate password reset request
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo and Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <Brain className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {t('app.name', 'Smriti Care')}
            </span>
          </Link>
          <p className="text-stone-500 text-sm">
            {t('app.tagline', 'Helping memories stay connected.')}
          </p>
        </div>

        <Card variant="elevated" padding="lg" className="border border-stone-200/80">
          <CardBody className="pt-0">
            {isSubmitted ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-stone-900">
                  Check your email
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-stone-800">{email}</span>. Please check your inbox and spam folder.
                </p>
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                  >
                    Resend Email
                  </Button>
                </div>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 font-medium text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {t('auth.login', 'Sign In')}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                    {t('auth.forgot_password', 'Forgot Password?')}
                  </h2>
                  <p className="text-sm text-stone-500">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-stone-700">
                    {t('auth.email', 'Email')}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base transition-colors"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full h-12 text-base font-semibold"
                >
                  {t('auth.reset_password', 'Reset Password')}
                </Button>

                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 font-medium text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {t('auth.login', 'Sign In')}
                  </Link>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
