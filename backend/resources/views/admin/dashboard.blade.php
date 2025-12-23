@extends('admin.layouts.app')

@section('title', 'Tableau de bord')

@section('content')
<h1 class="mb-4">Tableau de bord Administrateur</h1>

<div class="row">
    <div class="col-md-3 mb-4">
        <div class="card text-white bg-primary">
            <div class="card-body">
                <h5 class="card-title">Total Utilisateurs</h5>
                <p class="card-text display-4">{{ $totalUsers }}</p>
            </div>
        </div>
    </div>

    <div class="col-md-3 mb-4">
        <div class="card text-white bg-success">
            <div class="card-body">
                <h5 class="card-title">Utilisateurs Actifs</h5>
                <p class="card-text display-4">{{ $activeUsers }}</p>
            </div>
        </div>
    </div>

    <div class="col-md-3 mb-4">
        <div class="card text-white bg-warning">
            <div class="card-body">
                <h5 class="card-title">En Attente</h5>
                <p class="card-text display-4">{{ $pendingUsers }}</p>
            </div>
        </div>
    </div>

    <div class="col-md-3 mb-4">
        <div class="card text-white bg-info">
            <div class="card-body">
                <h5 class="card-title">Catégories</h5>
                <p class="card-text display-4">{{ $categoriesCount }}</p>
            </div>
        </div>
    </div>
</div>

<div class="row mt-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5>Actions rapides</h5>
            </div>
            <div class="card-body">
                <div class="d-grid gap-2">
                    <a href="{{ route('admin.profile_requests') }}" class="btn btn-warning">
                        <i class="bi bi-person-check"></i> Valider les demandes ({{ $pendingUsers }})
                    </a>
                    <a href="{{ route('admin.categories.index') }}" class="btn btn-primary">
                        <i class="bi bi-tags"></i> Gérer les catégories
                    </a>
                    <a href="{{ route('admin.exports.csv') }}" class="btn btn-success">
                        <i class="bi bi-file-earmark-text"></i> Exporter en CSV
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5>Dernières inscriptions</h5>
            </div>
            <div class="card-body">
                <div class="list-group">
                    @forelse($recentUsers as $user)
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between">
                            <div>
                                <strong>{{ $user->name }}</strong>
                                <br>
                                <small>{{ $user->email }}</small>
                            </div>
                            <span class="badge bg-{{ $user->is_active ? 'success' : 'warning' }}">
                                {{ $user->is_active ? 'Actif' : 'En attente' }}
                            </span>
                        </div>
                    </div>
                    @empty
                    <div class="list-group-item text-center">Aucun utilisateur récent</div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
