import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import bcrypt from 'bcryptjs';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const db = getFirestore();
    const storage = getStorage();

    useEffect(() => {
        const fetchUserData = async () => {
            const sessionData = JSON.parse(sessionStorage.getItem('user'));
            if (sessionData && sessionData.email) {
                const userEmail = sessionData.email;

                try {
                    const staffRef = collection(db, 'staff');
                    const q = query(staffRef, where('email', '==', userEmail));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        userData.id = querySnapshot.docs[0].id;
                        setUser(userData);
                        setFormData(userData);
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                }
            }
        };

        fetchUserData();
    }, [db]);

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const togglePasswordVisibility = (type) => {
        if (type === 'old') {
            setShowOldPassword(!showOldPassword);
        } else {
            setShowNewPassword(!showNewPassword);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (oldPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (isPasswordValid) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                let imageUrl = formData.profileImage;
                if (profileImage) {
                    const imageRef = ref(storage, `profileImages/${user.id}`);
                    await uploadBytes(imageRef, profileImage);
                    imageUrl = await getDownloadURL(imageRef);
                }

                const userRef = doc(db, 'staff', user.id);
                await updateDoc(userRef, { 
                    ...formData, 
                    password: hashedPassword, 
                    profileImage: imageUrl 
                });

                setShowEditModal(false);
                setPasswordError('');
                setUser({ ...user, ...formData, password: hashedPassword, profileImage: imageUrl });
                alert('Profile updated successfully');
            } else {
                setPasswordError('Old password is incorrect');
            }
        } else {
            setPasswordError('Please fill in both password fields');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-sidebar">
                <div className="profile-picture">
                    <img src={user?.profileImage || 'default-profile.png'} alt="Profile" />
                </div>
                <h2>{user?.name || 'Your Name'}</h2>
            </div>
            <div className="profile-details">
                <h3>Your Account</h3>
                <div className="detail-field">
                    <label>Name:</label>
                    <span>{user?.name || 'Not available'}</span>
                </div>
                <div className="detail-field">
                    <label>Mobile:</label>
                    <span>{user?.phone || 'Not available'}</span>
                </div>
                <div className="detail-field">
                    <label>Email:</label>
                    <span>{user?.email || 'Not available'}</span>
                </div>
                <div className="detail-field">
                    <label>Address:</label>
                    <span>{user?.address || 'Not available'}</span>
                </div>
                <button className="edit-profile-button" onClick={handleEditProfile}>Edit</button>
            </div>

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Profile</h3>
                        <form onSubmit={handlePasswordUpdate}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                            />
                            <label>Mobile</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                            />
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                            />
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleInputChange}
                            />
                            <label>Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <label>Old Password</label>
                            <div className="password-field">
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <button type="button" className="eye-button" onClick={() => togglePasswordVisibility('old')}>
                                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <label>New Password</label>
                            <div className="password-field">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button type="button" className="eye-button" onClick={() => togglePasswordVisibility('new')}>
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <button type="submit" className="up">Update</button>
                            <button type="button" className="cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
