import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { User, Upload, Loader2 } from 'lucide-react';
import { RootState } from '../../store/store';
import { updateProfile, updatePassword } from '../../store/authSlice';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  avatar: z.string()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function ProfileForm() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setErrors({ avatar: 'Please upload an image file' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ avatar: 'File size must be less than 5MB' });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        setIsUploading(false);
        console.log(formData);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors({ avatar: 'Failed to upload image' });
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = profileSchema.parse(formData);
      console.log(validatedData)
      await dispatch(updateProfile(validatedData));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = passwordSchema.parse(passwordData);
      await dispatch(updatePassword(validatedData));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={handleAvatarClick}
            className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            disabled={isUploading}
          >
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </button>
          <button
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-sm text-gray-500">Update your profile information</p>
        </div>
      </div>

      {errors.avatar && (
        <p className="text-sm text-red-600">{errors.avatar}</p>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Save Profile'
          )}
        </button>
      </form>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}