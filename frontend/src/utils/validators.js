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
  first_name: yup.string().required('Le prénom est requis'),
  last_name: yup.string().required('Le nom est requis'),
  birth_date: yup.date().required('La date de naissance est requise'),
  gender: yup.string().required('Le genre est requis'),
  phone: yup.string().required('Le téléphone est requis'),
  address: yup.string().required('L\'adresse est requise'),
  city: yup.string().required('La ville est requise'),
  country: yup.string().required('Le pays est requis'),
  category: yup.string().required('La catégorie est requise'),
  sector: yup.string().required('Le secteur d\'activité est requis'),
  education_level: yup.string().required('Le niveau d\'étude est requis'),
  bio: yup.string().max(1000, 'La biographie ne peut dépasser 1000 caractères'),
  skills: yup.string().nullable(),
  experiences: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Le titre est requis'),
      company: yup.string().required('L\'entreprise est requise'),
      start_date: yup.string().required('La date de début est requise'),
      end_date: yup.string().nullable(),
      description: yup.string()
    })
  ).nullable()
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
