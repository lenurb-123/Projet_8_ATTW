@extends('admin.layouts.app')

@section('title', 'Nouvelle Catégorie')

@section('content')
<div class="card">
    <div class="card-header">
        <h4><i class="bi bi-plus-circle"></i> Nouvelle Catégorie</h4>
    </div>
    <div class="card-body">
        <form action="{{ route('admin.categories.store') }}" method="POST">
            @csrf

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Nom de la catégorie *</label>
                    <input type="text"
                           class="form-control @error('name') is-invalid @enderror"
                           id="name"
                           name="name"
                           value="{{ old('name') }}"
                           required>
                    @error('name')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                    <small class="text-muted">Ex: "Cadres Techniques", "Artisans"</small>
                </div>

                <div class="col-md-6 mb-3">
                    <label for="type" class="form-label">Type *</label>
                    <select class="form-select @error('type') is-invalid @enderror"
                            id="type"
                            name="type"
                            required>
                        <option value="">Sélectionnez un type</option>
                        @foreach($types as $key => $label)
                            <option value="{{ $key }}" {{ old('type') == $key ? 'selected' : '' }}>
                                {{ $label }}
                            </option>
                        @endforeach
                    </select>
                    @error('type')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="col-12 mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control @error('description') is-invalid @enderror"
                              id="description"
                              name="description"
                              rows="3">{{ old('description') }}</textarea>
                    @error('description')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                    <small class="text-muted">Description courte de la catégorie (max 500 caractères)</small>
                </div>
            </div>

            <div class="d-flex justify-content-between">
                <a href="{{ route('admin.categories.index') }}" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Retour
                </a>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check-circle"></i> Créer la catégorie
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
