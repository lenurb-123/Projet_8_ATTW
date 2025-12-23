@extends('admin.layouts.app')

@section('title', 'Détails Utilisateur')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1><i class="bi bi-person"></i> Détails de l'Utilisateur</h1>
    <div>
        <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Retour à la liste
        </a>
    </div>
</div>

<div class="row">
    <div class="col-md-4 mb-4">
        <div class="card">
            <div class="card-header">
                <h5>Photo de profil</h5>
            </div>
            <div class="card-body text-center">
                @if($user->profile && $user->profile->photo_path)
                    <img src="{{ asset('storage/' . $user->profile->photo_path) }}"
                         class="img-fluid rounded-circle mb-3"
                         alt="Photo de profil"
                         style="width: 200px; height: 200px; object-fit: cover;">
                @else
                    <div class="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                         style="width: 200px; height: 200px;">
                        <i class="bi bi-person" style="font-size: 4rem;"></i>
                    </div>
                    <p class="text-muted">Aucune photo de profil</p>
                @endif
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-header">
                <h5>Actions</h5>
            </div>
            <div class="card-body">
                @if($user->role !== 'admin')
                    @if($user->is_active)
                        <form action="{{ route('admin.users.deactivate', $user) }}" method="POST" class="mb-2">
                            @csrf
                            <button type="submit"
                                    class="btn btn-warning w-100"
                                    onclick="return confirm('Désactiver cet utilisateur ?')">
                                <i class="bi bi-pause-circle"></i> Désactiver l'utilisateur
                            </button>
                        </form>
                    @else
                        <form action="{{ route('admin.users.activate', $user) }}" method="POST" class="mb-2">
                            @csrf
                            <button type="submit"
                                    class="btn btn-success w-100"
                                    onclick="return confirm('Activer cet utilisateur ?')">
                                <i class="bi bi-play-circle"></i> Activer l'utilisateur
                            </button>
                        </form>
                    @endif
                @endif

                @if($user->profile && $user->profile->cv_path)
                    <a href="{{ asset('storage/' . $user->profile->cv_path) }}"
                       target="_blank"
                       class="btn btn-outline-primary w-100 mb-2">
                        <i class="bi bi-file-earmark-text"></i> Voir le CV
                    </a>
                @endif

                <div class="mt-3 pt-3 border-top">
                    <small class="text-muted">
                        <i class="bi bi-info-circle"></i> ID: {{ $user->id }}<br>
                        Inscrit le: {{ $user->created_at->format('d/m/Y à H:i') }}
                    </small>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header">
                <h5><i class="bi bi-person-badge"></i> Informations Personnelles</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Nom complet</label>
                        <div class="fs-5">{{ $user->name }}</div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Email</label>
                        <div class="fs-5">{{ $user->email }}</div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Rôle</label>
                        <div>
                            @if($user->role === 'admin')
                                <span class="badge bg-danger fs-6">Administrateur</span>
                            @else
                                <span class="badge bg-primary fs-6">Utilisateur</span>
                            @endif
                        </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Statut</label>
                        <div>
                            @if($user->is_active)
                                <span class="badge bg-success fs-6">Actif</span>
                            @else
                                <span class="badge bg-warning text-dark fs-6">Inactif</span>
                            @endif
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Catégorie</label>
                        <div>
                            @if($user->category)
                                <span class="badge bg-info fs-6">{{ $user->category->name }}</span>
                            @else
                                <span class="badge bg-secondary fs-6">Non catégorisé</span>
                            @endif
                        </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Téléphone</label>
                        <div class="fs-5">{{ $user->profile->contacts ?? 'Non renseigné' }}</div>
                    </div>
                </div>
            </div>
        </div>

        @if($user->profile && ($user->profile->bio || $user->profile->competences || $user->profile->experiences))
        <div class="card mb-4">
            <div class="card-header">
                <h5><i class="bi bi-file-earmark-text"></i> Profil Professionnel</h5>
            </div>
            <div class="card-body">
                @if($user->profile->bio)
                <div class="mb-4">
                    <h6>Biographie</h6>
                    <p class="text-muted">{{ $user->profile->bio }}</p>
                </div>
                @endif

                @if($user->profile->competences)
                <div class="mb-4">
                    <h6>Compétences</h6>
                    <div class="text-muted">
                        @php
                            $competences = explode("\n", $user->profile->competences);
                        @endphp
                        @foreach($competences as $competence)
                            @if(trim($competence))
                                <span class="badge bg-light text-dark border me-1 mb-1">{{ trim($competence) }}</span>
                            @endif
                        @endforeach
                    </div>
                </div>
                @endif

                @if($user->profile->experiences)
                <div>
                    <h6>Expériences</h6>
                    <div class="text-muted">
                        @php
                            $experiences = explode("\n", $user->profile->experiences);
                        @endphp
                        <ul class="list-unstyled">
                            @foreach($experiences as $experience)
                                @if(trim($experience))
                                    <li><i class="bi bi-check-circle text-success me-2"></i>{{ trim($experience) }}</li>
                                @endif
                            @endforeach
                        </ul>
                    </div>
                </div>
                @endif
            </div>
        </div>
        @endif

        <div class="card">
            <div class="card-header">
                <h5><i class="bi bi-clock-history"></i> Activité</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 text-center">
                        <div class="bg-light rounded p-3">
                            <i class="bi bi-calendar-check" style="font-size: 2rem;"></i>
                            <h6 class="mt-2">Date d'inscription</h6>
                            <p class="mb-0">{{ $user->created_at->format('d/m/Y') }}</p>
                        </div>
                    </div>

                    <div class="col-md-4 text-center">
                        <div class="bg-light rounded p-3">
                            <i class="bi bi-clock" style="font-size: 2rem;"></i>
                            <h6 class="mt-2">Dernière mise à jour</h6>
                            <p class="mb-0">{{ $user->updated_at->format('d/m/Y') }}</p>
                        </div>
                    </div>

                    <div class="col-md-4 text-center">
                        <div class="bg-light rounded p-3">
                            <i class="bi bi-envelope" style="font-size: 2rem;"></i>
                            <h6 class="mt-2">Email vérifié</h6>
                            <p class="mb-0">
                                @if($user->email_verified_at)
                                    <span class="badge bg-success">Oui</span>
                                @else
                                    <span class="badge bg-warning">Non</span>
                                @endif
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@if($user->profile && ($user->profile->cv_path || $user->profile->documents))
<div class="card mt-4">
    <div class="card-header">
        <h5><i class="bi bi-folder"></i> Documents</h5>
    </div>
    <div class="card-body">
        <div class="row">
            @if($user->profile->cv_path)
            <div class="col-md-4 mb-3">
                <div class="card border">
                    <div class="card-body text-center">
                        <i class="bi bi-file-earmark-pdf text-danger" style="font-size: 3rem;"></i>
                        <h6 class="mt-2">Curriculum Vitae</h6>
                        <a href="{{ asset('storage/' . $user->profile->cv_path) }}"
                           target="_blank"
                           class="btn btn-sm btn-outline-primary mt-2">
                            <i class="bi bi-download"></i> Télécharger
                        </a>
                    </div>
                </div>
            </div>
            @endif

        </div>
    </div>
</div>
@endif

<div class="card mt-4 border-warning">
    <div class="card-header bg-warning text-dark">
        <h5><i class="bi bi-shield-check"></i> Informations de Sécurité</h5>
    </div>
    <div class="card-body">
        <div class="alert alert-warning">
            <i class="bi bi-exclamation-triangle"></i>
            <strong>Attention :</strong> Ces informations sont sensibles.
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Type de compte</label>
                    <div>
                        @if($user->role === 'admin')
                            <span class="badge bg-danger">Compte Administrateur</span>
                            <p class="text-muted small mt-1">Accès complet au système</p>
                        @else
                            <span class="badge bg-primary">Compte Utilisateur</span>
                            <p class="text-muted small mt-1">Accès limité aux fonctionnalités publiques</p>
                        @endif
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Statut du compte</label>
                    <div>
                        @if($user->is_active)
                            <span class="badge bg-success">Compte Actif</span>
                            <p class="text-muted small mt-1">L'utilisateur peut se connecter</p>
                        @else
                            <span class="badge bg-warning text-dark">Compte Inactif</span>
                            <p class="text-muted small mt-1">L'utilisateur ne peut pas se connecter</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-3">
            <small class="text-muted">
                <i class="bi bi-info-circle"></i>
                Dernière connexion : {{ $user->last_login_at ?? 'Jamais connecté' }}
            </small>
        </div>
    </div>
</div>
@endsection
