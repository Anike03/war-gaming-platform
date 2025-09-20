import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import { User, Mail, Calendar, Heart, Type, Save, X, Upload, Camera } from 'lucide-react';

const EditProfile = () => {
  const { userData, updateUserData, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    bio: userData?.bio || '',
    hobby: userData?.hobby || '',
    dob: userData?.dob || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserData(formData);
      
      // Update display name in auth profile if changed
      if (formData.displayName !== userData.displayName) {
        await updateUserProfile({ displayName: formData.displayName });
      }
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // TODO: Implement avatar upload functionality
    // This would involve uploading to Firebase Storage and updating user profile
    console.log('Avatar upload:', file);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      {error && (
        <div className="bg-danger/20 text-danger p-3 rounded-lg mb-6 flex items-center gap-2">
          <X size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-success/20 text-success p-3 rounded-lg mb-6 flex items-center gap-2">
          <Save size={20} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
            >
              <Camera size={16} className="text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-medium">Profile Picture</p>
            <p className="text-sm text-muted">Click the camera icon to upload a new photo</p>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="form-label flex items-center gap-2">
            <User size={16} />
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your display name"
            maxLength={50}
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="form-label flex items-center gap-2">
            <Mail size={16} />
            Email Address
          </label>
          <input
            type="email"
            value={userData?.email || ''}
            className="form-input bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            readOnly
            disabled
          />
          <p className="text-sm text-muted mt-1">Email cannot be changed</p>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="form-label flex items-center gap-2">
            <Calendar size={16} />
            Date of Birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="form-label flex items-center gap-2">
            <Type size={16} />
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Tell us about yourself..."
            rows={3}
            maxLength={200}
          />
          <p className="text-sm text-muted mt-1">
            {formData.bio.length}/200 characters
          </p>
        </div>

        {/* Hobby */}
        <div>
          <label htmlFor="hobby" className="form-label flex items-center gap-2">
            <Heart size={16} />
            Hobby
          </label>
          <input
            id="hobby"
            name="hobby"
            type="text"
            value={formData.hobby}
            onChange={handleChange}
            className="form-input"
            placeholder="What do you enjoy doing?"
            maxLength={50}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save size={20} />
            )}
            Save Changes
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({
              displayName: userData?.displayName || '',
              bio: userData?.bio || '',
              hobby: userData?.hobby || '',
              dob: userData?.dob || ''
            })}
            className="btn btn-secondary flex items-center gap-2"
          >
            <X size={20} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;