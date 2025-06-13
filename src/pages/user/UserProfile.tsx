import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card, { CardContent } from '../../components/common/Card';
import { Mail, User as UserIcon, Wallet } from 'lucide-react';
import { userService } from '../../services/user';
import { Loader2 } from 'lucide-react';
import Input from '../../components/common/Input';

interface UserProfileData {
  id: string;
  name?: string;
  email: string;
  walletAddress?: string;
  role: string;
  phoneNumber?: string;
  address?: string;
  profilePictureUrl?: string;
}

const UserProfile: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // console.log('Fetching profile for user:', authState.user); // Debug log
        const data = await userService.getUserById(authState.user!.id);
        // console.log('Fetched profile data:', data); // Debug log
        setUserProfile(data);
        setFormData(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authState, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(formData ? { ...formData, [name]: value } : null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(userProfile ? { ...userProfile } : null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(userProfile ? { ...userProfile } : null);
  };

  const handleSaveClick = async () => {
    if (!formData || !userProfile) return;

    if (!userProfile.id) {
      console.error('Cannot save profile: userProfile.id is undefined.', userProfile);
      alert('Error: User ID is missing. Cannot save profile.');
      return;
    }

    setIsSaving(true);
    // console.log('Attempting to save profile for user ID:', userProfile.id);
    try {
      const updatedProfile = await userService.updateUser(userProfile.id, formData);
      setUserProfile(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;

    // console.log('Current userProfile:', userProfile); // Debug log

    try {
      setIsUploading(true);
      // console.log('Uploading profile picture for user ID:', userProfile.id); // Debug log
      const updatedUser = await userService.uploadProfilePicture(userProfile.id, file);
      // console.log('Updated user after upload:', updatedUser); // Debug log
      setUserProfile(updatedUser);
      setFormData(updatedUser);
      alert('Profile picture updated successfully!');
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      alert(`Failed to upload profile picture: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2 text-gray-700">{error || 'Could not load user profile.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src={userProfile.profilePictureUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
            />
            {isEditing && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleChangePhotoClick}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={formData?.name || ''}
                onChange={handleInputChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData?.email || ''}
                onChange={handleInputChange}
                disabled
              />
              <Input
                label="Wallet Address"
                name="walletAddress"
                value={formData?.walletAddress || ''}
                onChange={handleInputChange}
                disabled
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData?.phoneNumber || ''}
                onChange={handleInputChange}
              />
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData?.address || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-lg text-gray-900">{userProfile.name || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg text-gray-900">{userProfile.email}</p>
              </div>
              {userProfile.walletAddress && (
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm font-medium text-gray-500">Wallet Address</p>
                  <p className="mt-1 text-lg text-gray-900 break-all">{userProfile.walletAddress}</p>
                </div>
              )}
              {userProfile.phoneNumber && (
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="mt-1 text-lg text-gray-900">{userProfile.phoneNumber}</p>
                </div>
              )}
              {userProfile.address && (
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 text-lg text-gray-900">{userProfile.address}</p>
                </div>
              )}
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="mt-1 text-lg text-gray-900">{userProfile.role}</p>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={handleCancelClick} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveClick} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 