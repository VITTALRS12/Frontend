import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile and address data
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchProfile();
        await fetchAddresses();
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data?.profile);
    setPhotoPreview(res.data?.profile?.profilePhoto);
  };

  const fetchAddresses = async () => {
    const res = await axios.get('/api/profile/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(res.data?.addresses || []);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview before upload
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      await axios.post('/api/profile/photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile photo updated');
      await fetchProfile();
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading Profile...</div>;
  }

  if (!profile) {
    return <div style={styles.error}>Could not load profile</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Profile</h1>

      {/* Profile Photo */}
      <div style={styles.photoSection}>
        <img
          src={photoPreview || 'https://placehold.co/100x100'}
          alt="Profile"
          style={styles.avatar}
        />
        <input type="file" onChange={handlePhotoUpload} style={styles.fileInput} />
      </div>

      {/* Profile Info */}
      <div style={styles.infoBox}>
        <p><strong>Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
        {profile.dateOfBirth && (
          <p><strong>DOB:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
        )}
        {profile.gender && <p><strong>Gender:</strong> {profile.gender}</p>}
        <p><strong>Referral Code:</strong> {profile.referralCode}</p>
        <p><strong>Joined On:</strong> {new Date(profile.joinDate).toDateString()}</p>
      </div>

      {/* Address List */}
      <div>
        <h2 style={styles.subheading}>My Addresses</h2>
        {addresses.length === 0 ? (
          <p style={styles.mutedText}>No addresses added yet.</p>
        ) : (
          addresses.map(addr => (
            <div key={addr._id} style={styles.addressCard}>
              <p style={styles.boldText}>{addr.name}</p>
              <p>{[addr.addressLine1, addr.addressLine2].filter(Boolean).join(', ')}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <p>{addr.country}</p>
              {addr.isDefault && <span style={styles.defaultBadge}>Default</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '720px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '20px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
  subheading: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '30px 0 10px',
  },
  photoSection: {
    marginBottom: '20px',
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ccc',
    marginBottom: '10px',
  },
  fileInput: {
    display: 'block',
    marginTop: '10px',
  },
  infoBox: {
    padding: '15px 20px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  addressCard: {
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#fff',
  },
  boldText: {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '5px',
  },
  defaultBadge: {
    display: 'inline-block',
    backgroundColor: '#22c55e',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '4px',
    padding: '2px 6px',
    marginTop: '5px',
  },
  mutedText: {
    color: '#888',
    fontStyle: 'italic',
  },
  loading: {
    padding: '50px',
    textAlign: 'center',
    fontSize: '18px',
  },
  error: {
    padding: '50px',
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
  },
};

export default ProfilePage;
