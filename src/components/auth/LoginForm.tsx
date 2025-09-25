// LoginForm Component
import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { LoginCredentials } from "../../types";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-200/50">
      <div className="text-center mb-8 lg:mb-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Đăng Nhập
        </h2>
        <p className="text-gray-600 text-base lg:text-lg">
          Truy cập hệ thống quản lý sân thể thao
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Tên đăng nhập
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base lg:text-lg hover:border-gray-400 bg-gray-50/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-4 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base lg:text-lg hover:border-gray-400 bg-gray-50/50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" />
              ) : (
                <Eye className="w-5 h-5 lg:w-6 lg:h-6" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-base lg:text-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl shadow-green-500/30 uppercase tracking-wide"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang đăng nhập...</span>
            </div>
          ) : (
            "Đăng Nhập"
          )}
        </button>
      </form>

      <div className="mt-6 lg:mt-8 text-center">
        <p className="text-sm lg:text-base text-gray-600">
          Bảo mật bởi{" "}
          <span className="font-bold text-green-600">SportHub Security</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;