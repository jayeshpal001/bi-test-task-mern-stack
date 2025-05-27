import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkPasswordStrength = (value) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;
    return strongRegex.test(value) ? 3 : mediumRegex.test(value) ? 2 : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic client-side validation
      if (!isLogin && phone && !/^\d{10}$/.test(phone)) {
        throw new Error('Invalid phone number format (10 digits required)');
      }

      const payload = isLogin
        ? { email, password }
        : { name, email, phone, password };

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        setName('');
        setPhone('');
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <FiPhone className="absolute top-3 left-3 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                pattern="[0-9]{10}"
                title="10 digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={isLogin ? 6 : 8}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!isLogin) setPasswordStrength(checkPasswordStrength(e.target.value));
              }}
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {!isLogin && (
            <div className="flex gap-1 h-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-1/3 rounded-full transition-all duration-300 ${
                    passwordStrength > i 
                      ? 'bg-green-500 h-full' 
                      : 'bg-gray-200 h-1/2 mt-0.5'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg transition-colors ${
              isLoading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <button
              type="button"
              className="p-2 rounded-lg border hover:bg-gray-50"
              onClick={() => {/* Implement OAuth */}}
            >
              <img src="/google-icon.svg" className="w-6 h-6" alt="Google" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg border hover:bg-gray-50"
              onClick={() => {/* Implement OAuth */}}
            >
              <img src="/github-icon.svg" className="w-6 h-6" alt="GitHub" />
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-all"
          >
            {isLogin ? 'Sign up here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}