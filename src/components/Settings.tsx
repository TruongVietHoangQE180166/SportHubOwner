import React from "react";
import { UserProfile } from "../types";
import ProfileSettings from "./settings/ProfileSettings";
import PaymentSettings from "./settings/PaymentSettings";
import SecuritySettings from "./settings/SecuritySettings";

interface SettingsProps {
  user: UserProfile | null;
  userLoading: boolean;
  userError: string | null;
  onUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<void>;
  clearUserError: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  user,
  userLoading,
  userError,
  onUpdateUser,
  onUploadAvatar,
  clearUserError,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-0">
        {/* Profile Settings */}
        {user && (
          <ProfileSettings
            user={user}
            loading={userLoading}
            error={userError}
            onUpdateUser={onUpdateUser}
            onUploadAvatar={onUploadAvatar}
            clearError={clearUserError}
          />
        )}

        {/* Payment Settings */}
        <PaymentSettings />

        {/* Security Settings */}
        <SecuritySettings />
      </div>
    </div>
  );
};

export default Settings;
