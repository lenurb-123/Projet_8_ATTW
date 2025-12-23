@extends('admin.layouts.app')

@section('title', 'Gestion des Catégories')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1><i class="bi bi-tags"></i> Catégories</h1>
    <a href="{{ route('admin.categories.create') }}" class="btn btn-primary">
        <i class="bi bi-plus-circle"></i> Nouvelle Catégorie
    </a>
</div>

@if(session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

@if(session('error'))
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ session('error') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Utilisateurs</th>
                        <th>Date création</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($categories as $category)
                    <tr>
                        <td>{{ $category->id }}</td>
                        <td>
                            <strong>{{ $category->name }}</strong>
                            <br>
                            <small class="text-muted">Slug: {{ $category->slug }}</small>
                        </td>
                        <td>
                            @php
                                $types = [
                                    'cadre_administratif' => '<span class="badge bg-primary">Cadre Admin</span>',
                                    'cadre_technique' => '<span class="badge bg-info">Cadre Technique</span>',
                                    'chef_entreprise' => '<span class="badge bg-success">Chef Entreprise</span>',
                                    'artisan' => '<span class="badge bg-warning">Artisan</span>',
                                    'commercant' => '<span class="badge bg-secondary">Commerçant</span>',
                                    'jeune_entrepreneur' => '<span class="badge bg-danger">Jeune Entrepreneur</span>',
                                    'investisseur' => '<span class="badge bg-dark">Investisseur</span>'
                                ];
                            @endphp
                            {!! $types[$category->type] ?? $category->type !!}
                        </td>
                        <td>{{ Str::limit($category->description, 50) }}</td>
                        <td>
                            <span class="badge bg-primary">{{ $category->users_count }}</span>
                        </td>
                        <td>{{ $category->created_at->format('d/m/Y') }}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <a href="{{ route('admin.categories.edit', $category) }}"
                                   class="btn btn-outline-primary" title="Modifier">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <form action="{{ route('admin.categories.destroy', $category) }}"
                                      method="POST" class="d-inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit"
                                            class="btn btn-outline-danger"
                                            title="Supprimer"
                                            onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            <div class="text-muted">
                                <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                                <p class="mt-2">Aucune catégorie créée</p>
                                <a href="{{ route('admin.categories.create') }}" class="btn btn-primary mt-2">
                                    Créer votre première catégorie
                                </a>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
