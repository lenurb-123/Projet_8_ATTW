import {useEffect, useState} from 'react';
import {professionalService, profileService} from '../services/allServices';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getMyProfile();
            setProfile(data);
            setError(null);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erreur chargement profil';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            const updated = await profileService.updateProfile(profileData);
            setProfile(updated);
            setError(null);
            return updated;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erreur mise à jour';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const uploadDocument = async (file, type) => {
        try {
            return await professionalService.uploadDocument(file, type);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erreur upload';
            setError(errorMessage);
            throw err;
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        uploadDocument
    };
};