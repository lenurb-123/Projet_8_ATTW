import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email invalide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .required('Le mot de passe est requis'),
});

export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: yup
    .string()
    .email('Email invalide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
});

export const profileSchema = yup.object({
  firstName: yup.string().required('Le prénom est requis'),
  lastName: yup.string().required('Le nom est requis'),
  dateOfBirth: yup.date().required('La date de naissance est requise'),
  gender: yup.string().required('Le genre est requis'),
  phone: yup.string().required('Le téléphone est requis'),
  address: yup.string().required('L\'adresse est requise'),
  category: yup.string().required('La catégorie est requise'),
  sector: yup.string().required('Le secteur d\'activité est requis'),
  educationLevel: yup.string().required('Le niveau d\'étude est requis'),
  bio: yup.string().max(1000, 'La biographie ne peut dépasser 1000 caractères'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Email invalide')
    .required('L\'email est requis'),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
});
