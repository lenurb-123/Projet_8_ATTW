@extends('admin.layouts.app')

@section('title', 'Détails du Profil')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1><i class="bi bi-person"></i> Détails du Profil</h1>
    <div>
        <a href="{{ route('admin.profile_requests') }}" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Retour
        </a>
    </div>
</div>

<div class="row">
    <div class="col-md-4 mb-4">
        <div class="card">
            <div class="card-header">
                <h5>Photo</h5>
            </div>
            <div class="card-body text-center">
                @if($user->profile && $user->profile->photo_path)
                    <img src="{{ asset('storage/' . $user->profile->photo_path) }}"
                         class="img-fluid rounded"
                         alt="Photo"
                         style="max-width: 300px;">
                @else
                    <div class="bg-light rounded d-flex align-items-center justify-content-center"
                         style="height: 200px;">
                        <i class="bi bi-person" style="font-size: 3rem;"></i>
                    </div>
                    <p class="text-muted mt-2">Aucune photo</p>
                @endif
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-header">
                <h5>Actions</h5>
            </div>
            <div class="card-body">
                <div class="d-grid gap-2">
                    <form action="{{ route('admin.profile_requests.approve', $user) }}"
                          method="POST">
                        @csrf
                        <button type="submit"
                                class="btn btn-success btn-lg"
                                onclick="return confirm('Approuver ce profil ?')">
                            <i class="bi bi-check-lg"></i> Approuver le Profil
                        </button>
                    </form>

                    <button type="button"
                            class="btn btn-danger btn-lg"
                            data-bs-toggle="modal"
                            data-bs-target="#rejectModal">
                        <i class="bi bi-x-lg"></i> Rejeter le Profil
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h5>Informations Personnelles</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Nom Complet</label>
                        <p class="fs-5">{{ $user->name }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Email</label>
                        <p class="fs-5">{{ $user->email }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Catégorie</label>
                        <p class="fs-5">{{ $user->category->name ?? 'Non catégorisé' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Téléphone</label>
                        <p class="fs-5">{{ $user->profile->contacts ?? 'Non renseigné' }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 mb-3">
                        <label class="form-label text-muted">Date d'inscription</label>
                        <p class="fs-5">{{ $user->created_at->format('d/m/Y à H:i') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-header">
                <h5>Bio & Compétences</h5>
            </div>
            <div class="card-body">
                @if($user->profile && $user->profile->bio)
                <h6>Biographie</h6>
                <p class="text-muted">{{ $user->profile->bio }}</p>
                <hr>
                @endif

                @if($user->profile && $user->profile->competences)
                <h6>Compétences</h6>
                <p class="text-muted">{{ $user->profile->competences }}</p>
                <hr>
                @endif

                @if($user->profile && $user->profile->experiences)
                <h6>Expériences</h6>
                <p class="text-muted">{{ $user->profile->experiences }}</p>
                @endif
            </div>
        </div>

        @if($user->profile && $user->profile->cv_path)
        <div class="card mt-4">
            <div class="card-header">
                <h5>Curriculum Vitae</h5>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <i class="bi bi-file-earmark-pdf text-danger me-3" style="font-size: 2rem;"></i>
                    <div>
                        <p class="mb-1">CV téléchargé</p>
                        <a href="{{ asset('storage/' . $user->profile->cv_path) }}"
                           target="_blank"
                           class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-download"></i> Télécharger
                        </a>
                    </div>
                </div>
            </div>
        </div>
        @endif
    </div>
</div>

<div class="modal fade" id="rejectModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Rejeter le profil</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="{{ route('admin.profile_requests.reject', $user) }}" method="POST">
                @csrf
                <div class="modal-body">
                    <p>Êtes-vous sûr de vouloir rejeter le profil de <strong>{{ $user->name }}</strong> ?</p>
                    <div class="mb-3">
                        <label for="reason" class="form-label">Raison (optionnelle)</label>
                        <textarea class="form-control"
                                  id="reason"
                                  name="reason"
                                  rows="3"
                                  placeholder="Pourquoi rejetez-vous ce profil ?"></textarea>
                    </div>
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle"></i>
                        Cette action supprimera définitivement le profil.
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="submit" class="btn btn-danger">Confirmer le rejet</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
