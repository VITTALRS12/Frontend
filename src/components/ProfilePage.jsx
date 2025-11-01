import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  uploadPhoto,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../api/profileApi";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";
import PasswordChangeForm from "./PasswordChangeForm";
import ProfilePhotoUploader from "./ProfilePhotoUploader";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchProfile();
    await fetchAddresses();
  };

  const fetchProfile = async () => {
    setLoading(true);
    const { data } = await getProfile();
    setProfile(data.profile);
    setFormData({
      fullName: data.profile.fullName || "",
      dateOfBirth: data.profile.dateOfBirth
        ? data.profile.dateOfBirth.split("T")[0]
        : "",
      gender: data.profile.gender || "",
    });
    setLoading(false);
  };

  const fetchAddresses = async () => {
    const { data } = await getAddresses();
    setAddresses(data.addresses || []);
    if (data.addresses && data.addresses.length > 0) {
      setShowAddressForm(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    fetchProfile();
    setEditingProfile(false);
  };

  const handlePhotoUpload = async (file) => {
    const fd = new FormData();
    fd.append("photo", file);
    await uploadPhoto(fd);
    fetchProfile();
  };

  const handleAddAddress = async (address) => {
    await addAddress(address);
    fetchAddresses();
    setShowAddressForm(false);
  };

  const handleUpdateAddress = async (id, address) => {
    await updateAddress(id, address);
    fetchAddresses();
  };

  const handleDeleteAddress = async (id) => {
    await deleteAddress(id);
    fetchAddresses();
    if (addresses.length <= 1) {
      setShowAddressForm(true);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-section">
        <ProfilePhotoUploader
          photoUrl={profile.profilePhoto}
          onUpload={handlePhotoUpload}
          initials={profile.initials}
        />
        {editingProfile ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <label>
              Full Name
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </label>
            <label>
              Date of Birth
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </label>
            <label>
              Gender
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingProfile(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {profile.fullName}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {profile.dateOfBirth?.split("T")[0]}
            </p>
            <p>
              <strong>Gender:</strong> {profile.gender}
            </p>
            <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      <h3>Addresses</h3>
      <AddressList
        addresses={addresses}
        onDelete={handleDeleteAddress}
        onUpdate={handleUpdateAddress}
      />

      {/* Add Address and Change Password Buttons in the same row */}
      <div className="button-row">
        {!showAddressForm && addresses.length > 0 && (
          <button
            onClick={() => setShowAddressForm(true)}
            className="add-address-btn"
          >
            + Add New Address
          </button>
        )}

        {!showPasswordForm && (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="change-password-btn"
          >
            Change Password
          </button>
        )}
      </div>

      {(showAddressForm || addresses.length === 0) && (
        <AddressForm
          onAdd={handleAddAddress}
          onCancel={() => setShowAddressForm(false)}
        />
      )}

      {showPasswordForm && (
        <div className="change-password-section">
          <h3>Change Password</h3>
          <PasswordChangeForm />
          <button
            onClick={() => setShowPasswordForm(false)}
            className="cancel-password-btn"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
