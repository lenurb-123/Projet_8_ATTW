@extends('admin.layouts.app')

@section('title', 'Demandes de Validation')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1><i class="bi bi-person-check"></i> Demandes de Validation</h1>
    <div class="badge bg-warning text-dark fs-6">
        {{ $requests->count() }} demande(s) en attente
    </div>
</div>

@if(session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

@if($requests->isEmpty())
<div class="card">
    <div class="card-body text-center py-5">
        <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
        <h4 class="mt-3">Aucune demande en attente</h4>
        <p class="text-muted">Toutes les demandes ont été traitées</p>
    </div>
</div>
@else
<div class="row">
    @foreach($requests as $user)
    <div class="col-md-6 mb-4">
        <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">{{ $user->name }}</h5>
                <span class="badge bg-warning">En attente</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 text-center mb-3">
                        @if($user->profile && $user->profile->photo_path)
                            <img src="{{ asset('storage/' . $user->profile->photo_path) }}"
                                 class="img-fluid rounded-circle"
                                 alt="Photo"
                                 style="width: 100px; height: 100px; object-fit: cover;">
                        @else
                            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                 style="width: 100px; height: 100px;">
                                <i class="bi bi-person" style="font-size: 2rem;"></i>
                            </div>
                        @endif
                    </div>
                    <div class="col-md-8">
                        <h6>Informations</h6>
                        <ul class="list-unstyled">
                            <li><strong>Email:</strong> {{ $user->email }}</li>
                            <li><strong>Téléphone:</strong> {{ $user->profile->contacts ?? 'Non renseigné' }}</li>
                            <li><strong>Catégorie:</strong> {{ $user->category->name ?? 'Non catégorisé' }}</li>
                            <li><strong>Inscrit le:</strong> {{ $user->created_at->format('d/m/Y') }}</li>
                        </ul>

                        @if($user->profile && $user->profile->bio)
                        <h6 class="mt-3">Bio</h6>
                        <p class="text-muted">{{ Str::limit($user->profile->bio, 150) }}</p>
                        @endif
                    </div>
                </div>

                @if($user->profile && $user->profile->cv_path)
                <div class="mt-2">
                    <a href="{{ asset('storage/' . $user->profile->cv_path) }}"
                       target="_blank"
                       class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-file-earmark-text"></i> Voir CV
                    </a>
                </div>
                @endif
            </div>
            <div class="card-footer">
                <div class="d-flex justify-content-between">
                    <a href="{{ route('admin.profile_requests.show', $user) }}"
                       class="btn btn-info btn-sm">
                        <i class="bi bi-eye"></i> Voir détails
                    </a>
                    <div class="btn-group">
                        <form action="{{ route('admin.profile_requests.approve', $user) }}"
                              method="POST" class="d-inline">
                            @csrf
                            <button type="submit"
                                    class="btn btn-success btn-sm"
                                    onclick="return confirm('Approuver ce profil ?')">
                                <i class="bi bi-check-lg"></i> Approuver
                            </button>
                        </form>
                        <button type="button"
                                class="btn btn-danger btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#rejectModal{{ $user->id }}">
                            <i class="bi bi-x-lg"></i> Rejeter
                        </button>
                    </div>
                </div>

                <!-- Modal de rejet -->
                <div class="modal fade" id="rejectModal{{ $user->id }}" tabindex="-1">
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
                                        <label for="reason{{ $user->id }}" class="form-label">Raison (optionnelle)</label>
                                        <textarea class="form-control"
                                                  id="reason{{ $user->id }}"
                                                  name="reason"
                                                  rows="3"
                                                  placeholder="Pourquoi rejetez-vous ce profil ?"></textarea>
                                    </div>
                                    <div class="alert alert-warning">
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
            </div>
        </div>
    </div>
    @endforeach
</div>
@endif
@endsection
