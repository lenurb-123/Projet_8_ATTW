@extends('admin.layouts.app')

@section('title', 'Gestion des Utilisateurs')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1><i class="bi bi-people"></i> Utilisateurs</h1>
    <div class="badge bg-primary fs-6">
        {{ $users->total() }} utilisateur(s)
    </div>
</div>

<div class="card mb-4">
    <div class="card-header">
        <h5><i class="bi bi-funnel"></i> Filtres</h5>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.users.index') }}">
            <div class="row g-3">
                <div class="col-md-4">
                    <input type="text"
                           class="form-control"
                           name="search"
                           placeholder="Rechercher par nom ou email..."
                           value="{{ request('search') }}">
                </div>
                <div class="col-md-2">
                    <select class="form-select" name="status">
                        <option value="">Tous statuts</option>
                        <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Actifs</option>
                        <option value="inactive" {{ request('status') == 'inactive' ? 'selected' : '' }}>Inactifs</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" name="category">
                        <option value="">Toutes catégories</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}" {{ request('category') == $category->id ? 'selected' : '' }}>
                                {{ $category->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" name="role">
                        <option value="">Tous rôles</option>
                        <option value="admin" {{ request('role') == 'admin' ? 'selected' : '' }}>Admin</option>
                        <option value="user" {{ request('role') == 'user' ? 'selected' : '' }}>Utilisateur</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Catégorie</th>
                        <th>Rôle</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($users as $user)
                    <tr>
                        <td>{{ $user->id }}</td>
                        <td>
                            <div class="d-flex align-items-center">
                                @if($user->profile && $user->profile->photo_path)
                                    <img src="{{ asset('storage/' . $user->profile->photo_path) }}"
                                         class="rounded-circle me-2"
                                         alt="Photo"
                                         style="width: 32px; height: 32px; object-fit: cover;">
                                @else
                                    <div class="bg-light rounded-circle me-2 d-flex align-items-center justify-content-center"
                                         style="width: 32px; height: 32px;">
                                        <i class="bi bi-person text-muted"></i>
                                    </div>
                                @endif
                                <div>
                                    <strong>{{ $user->name }}</strong>
                                    @if($user->profile && $user->profile->contacts)
                                        <br>
                                        <small class="text-muted">{{ $user->profile->contacts }}</small>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td>{{ $user->email }}</td>
                        <td>
                            @if($user->category)
                                <span class="badge bg-info">{{ $user->category->name }}</span>
                            @else
                                <span class="badge bg-secondary">Non catégorisé</span>
                            @endif
                        </td>
                        <td>
                            @if($user->role === 'admin')
                                <span class="badge bg-danger">Administrateur</span>
                            @else
                                <span class="badge bg-primary">Utilisateur</span>
                            @endif
                        </td>
                        <td>
                            @if($user->is_active)
                                <span class="badge bg-success">Actif</span>
                            @else
                                <span class="badge bg-warning text-dark">Inactif</span>
                            @endif
                        </td>
                        <td>{{ $user->created_at->format('d/m/Y') }}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <a href="{{ route('admin.users.show', $user) }}"
                                   class="btn btn-outline-info"
                                   title="Voir détails">
                                    <i class="bi bi-eye"></i>
                                </a>

                                @if($user->role !== 'admin')
                                    @if($user->is_active)
                                        <form action="{{ route('admin.users.deactivate', $user) }}"
                                              method="POST"
                                              class="d-inline">
                                            @csrf
                                            <button type="submit"
                                                    class="btn btn-outline-warning"
                                                    title="Désactiver"
                                                    onclick="return confirm('Désactiver cet utilisateur ?')">
                                                <i class="bi bi-pause-circle"></i>
                                            </button>
                                        </form>
                                    @else
                                        <form action="{{ route('admin.users.activate', $user) }}"
                                              method="POST"
                                              class="d-inline">
                                            @csrf
                                            <button type="submit"
                                                    class="btn btn-outline-success"
                                                    title="Activer"
                                                    onclick="return confirm('Activer cet utilisateur ?')">
                                                <i class="bi bi-play-circle"></i>
                                            </button>
                                        </form>
                                    @endif
                                @endif
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="text-center py-4">
                            <div class="text-muted">
                                <i class="bi bi-people" style="font-size: 2rem;"></i>
                                <p class="mt-2">Aucun utilisateur trouvé</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($users->hasPages())
        <div class="d-flex justify-content-center mt-4">
            {{ $users->withQueryString()->links() }}
        </div>
        @endif
    </div>
</div>
@endsection
