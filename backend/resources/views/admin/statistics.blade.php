@extends('admin.layouts.app')

@section('title', 'Statistiques Détaillées')

@section('content')
<h1 class="mb-4"><i class="bi bi-graph-up"></i> Statistiques Détaillées</h1>

<div class="row mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <h5 class="card-title">Total Utilisateurs</h5>
                <h2 class="card-text">{{ $stats['totalUsers'] }}</h2>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body">
                <h5 class="card-title">Utilisateurs Actifs</h5>
                <h2 class="card-text">{{ $stats['activeUsers'] }}</h2>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-warning text-white">
            <div class="card-body">
                <h5 class="card-title">En Attente</h5>
                <h2 class="card-text">{{ $stats['pendingUsers'] }}</h2>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <h5 class="card-title">Administrateurs</h5>
                <h2 class="card-text">{{ $stats['adminUsers'] }}</h2>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h5><i class="bi bi-pie-chart"></i> Répartition par Catégorie</h5>
            </div>
            <div class="card-body">
                @if($stats['usersByCategory']->isNotEmpty())
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Nombre d'utilisateurs</th>
                                <th>Pourcentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($stats['usersByCategory'] as $category)
                            <tr>
                                <td>{{ $category->name }}</td>
                                <td>
                                    <span class="badge bg-primary">{{ $category->users_count }}</span>
                                </td>
                                <td>
                                    @php
                                        $percentage = $stats['totalUsers'] > 0
                                            ? round(($category->users_count / $stats['totalUsers']) * 100, 1)
                                            : 0;
                                    @endphp
                                    <div class="progress" style="height: 20px;">
                                        <div class="progress-bar"
                                             role="progressbar"
                                             style="width: {{ $percentage }}%">
                                            {{ $percentage }}%
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @else
                <p class="text-muted">Aucune donnée disponible</p>
                @endif
            </div>
        </div>
    </div>

    <div class="col-md-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h5><i class="bi bi-trophy"></i> Top 5 Catégories</h5>
            </div>
            <div class="card-body">
                @if($stats['topCategories']->isNotEmpty())
                <ol class="list-group list-group-numbered">
                    @foreach($stats['topCategories'] as $category)
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">{{ $category->name }}</div>
                            <small>{{ $category->description ?? 'Aucune description' }}</small>
                        </div>
                        <span class="badge bg-primary rounded-pill">{{ $category->users_count }}</span>
                    </li>
                    @endforeach
                </ol>
                @else
                <p class="text-muted">Aucune donnée disponible</p>
                @endif
            </div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <h5><i class="bi bi-clock-history"></i> 10 Dernières Inscriptions</h5>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Catégorie</th>
                        <th>Statut</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($stats['recentUsers'] as $user)
                    <tr>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>{{ $user->category->name ?? 'Non catégorisé' }}</td>
                        <td>
                            @if($user->is_active)
                                <span class="badge bg-success">Actif</span>
                            @else
                                <span class="badge bg-warning">En attente</span>
                            @endif
                        </td>
                        <td>{{ $user->created_at->format('d/m/Y H:i') }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="text-center text-muted">Aucune inscription récente</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
