import { useState } from 'react';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState('email');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password do not match');
      return;
    }

    const url = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Backend returned non-JSON:', text);
        alert('Server returned invalid response. Check console.');
        return;
      }

      if (!res.ok) {
        alert(`Error ${res.status}: ${data.error || data.message || JSON.stringify(data)}`);
        return;
      }

      const token = data.token || data.accessToken || data.data?.token;
      if (token) localStorage.setItem('token', token);

      let role = 'customer';
      if (data.role) role = data.role;
      else if (data.user?.role) role = data.user.role;
      else if (data.data?.user?.role) role = data.data.user.role;
      else if (data.user?.userRole) role = data.user.userRole;
      else if (data.data?.role) role = data.data.role;

      console.log("Detected Role:", role);

      if (isLogin) {
        onLoginSuccess(role);
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      alert(`Unexpected server error: ${err.message}`);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (forgotStep === 'email') {
      try {
        const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

        setForgotMessage('OTP sent to your email!');
        setForgotStep('otp');
      } catch (err) {
        setForgotMessage(err.message);
      }
    } else {
      if (newPassword !== confirmNewPassword) {
        setForgotMessage('Passwords do not match');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: forgotEmail,
            otp,
            newPassword
          })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Reset failed');

        setForgotMessage('Password reset successful! Please login.');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep('email');
          setForgotMessage('');
          setForgotEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmNewPassword('');
        }, 3000);
      } catch (err) {
        setForgotMessage(err.message);
      }
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-white dark:bg-black text-gray-900 dark:text-gray-100">

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-3xl shadow-2xl p-8 relative animate-zoomIn">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-6 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-3xl transition-transform hover:scale-110 duration-200"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
              Reset Password
            </h2>

            {forgotMessage && (
              <div className={`mb-6 p-4 rounded-2xl text-center text-sm border animate-pulseOnce ${
                forgotMessage.includes('successful')
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-800/50'
                  : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800/50'
              }`}>
                {forgotMessage}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-6">
              {forgotStep === 'email' ? (
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                />
              ) : (
                <>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                  />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                {forgotStep === 'email' ? 'Send OTP' : 'Verify & Reset Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Auth Form */}
      <div className="w-full max-w-md animate-fadeInSlow">
        <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => { setIsLogin(true); setFormData({ username: '', email: '', password: '', confirmPassword: '' }); }}
              className={`flex-1 py-5 text-center font-medium transition-all duration-300 ${
                isLogin 
                  ? 'text-black dark:text-white border-b-4 border-black dark:border-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setFormData({ username: '', email: '', password: '', confirmPassword: '' }); }}
              className={`flex-1 py-5 text-center font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'text-black dark:text-white border-b-4 border-black dark:border-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-3xl font-bold text-center mb-2 text-black dark:text-white">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-500 mb-8">
              {isLogin ? 'Enter your credentials to login' : 'Create an account'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                  required
                />
              )}
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                required
              />
              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all duration-300"
                  required
                />
              )}

              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white w-full text-right transition-colors duration-200"
                >
                  Forgot password?
                </button>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Simple CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSlow {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseOnce {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.02); }
        }

        .animate-fadeIn     { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fadeInSlow { animation: fadeInSlow 1s ease-out forwards; }
        .animate-zoomIn     { animation: zoomIn 0.4s ease-out forwards; }
        .animate-pulseOnce  { animation: pulseOnce 1.2s ease-in-out; }
      `}</style>
    </div>
  );
}