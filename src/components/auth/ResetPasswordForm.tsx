import React, { useState, useRef, useEffect } from "react";
import { Shield, ArrowLeft, CheckCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useRouter } from 'next/navigation';

interface ResetPasswordCredentials {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  onSubmit: (credentials: ResetPasswordCredentials) => void;
  onResendOTP: (email: string) => void;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  successMessage: string | null;
  email: string; // Email được truyền từ form forgot password
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  onResendOTP,
  isLoading,
  isResending,
  error,
  successMessage,
  email,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    otpRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      return;
    }

    onSubmit({
      email,
      otp: otp.join(''),
      newPassword,
      confirmPassword,
    });
  };

  const handleResendOTP = () => {
    onResendOTP(email);
    setResendTimer(300); // 5 minutes cooldown (300 seconds)
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const isOtpComplete = otp.every(digit => digit !== "");
  const isFormValid = isOtpComplete && newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMatch = !confirmPassword || newPassword === confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-green-500 rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 border-4 border-green-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-green-400 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-200/50">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Đặt Lại Mật Khẩu
            </h2>
            <p className="text-gray-600 text-sm">
              Nhập mã OTP và mật khẩu mới
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Gửi tới: {email}
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-3 rounded-full"></div>
          </div>

          {successMessage ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-medium text-green-700">{successMessage}</p>
              </div>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-bold text-sm hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500/50 focus:ring-offset-1 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shadow-green-500/30 uppercase tracking-wide"
              >
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Mã OTP (6 chữ số)
                </label>
                <div className="flex justify-center space-x-2 mb-3" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-10 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400 bg-gray-50/50"
                      placeholder="0"
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || isResending}
                    className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed text-xs font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {resendTimer > 0 
                        ? `Gửi lại sau ${resendTimer}s` 
                        : isResending 
                          ? 'Đang gửi...' 
                          : 'Gửi lại mã OTP'
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-3 py-2.5 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm hover:border-gray-400 bg-gray-50/50"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className={`w-full px-3 py-2.5 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm hover:border-gray-400 bg-gray-50/50 ${
                      !passwordsMatch ? 'border-red-300 bg-red-50/50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!passwordsMatch && confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">Mật khẩu xác nhận không khớp</p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-medium text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-bold text-sm hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500/50 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shadow-green-500/30 uppercase tracking-wide"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center space-x-1 text-gray-600 hover:text-green-600 transition-colors py-2 font-medium text-sm"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Quay lại đăng nhập</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Bảo mật bởi{" "}
              <span className="font-bold text-green-600">SportHub Security</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;