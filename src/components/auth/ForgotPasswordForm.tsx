import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { ForgotPasswordCredentials } from "../../types";
import { useRouter } from 'next/navigation';

interface ForgotPasswordFormProps {
  onSubmit: (credentials: ForgotPasswordCredentials) => void;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading,
  error,
  successMessage,
}) => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email });
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

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
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-200/50">
          <div className="text-center mb-8 lg:mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Quên Mật Khẩu
            </h2>
            <p className="text-gray-600 text-base lg:text-lg">
              Nhập email để nhận hướng dẫn đặt lại mật khẩu
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {successMessage ? (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-sm font-medium text-green-700">{successMessage}</p>
              </div>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-base lg:text-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl shadow-green-500/30 uppercase tracking-wide"
              >
                Quay lại đăng nhập
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@santhethao.com"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base lg:text-lg hover:border-gray-400 bg-gray-50/50"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-base lg:text-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl shadow-green-500/30 uppercase tracking-wide"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    "Gửi hướng dẫn"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-green-600 transition-colors py-3 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại đăng nhập</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 lg:mt-8 text-center">
            <p className="text-sm lg:text-base text-gray-600">
              Bảo mật bởi{" "}
              <span className="font-bold text-green-600">SportHub Security</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;