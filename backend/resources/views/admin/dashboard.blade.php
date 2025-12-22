<div class="container mt-5">
    <h1>Tableau de bord Admin</h1>

    <div class="row mt-4">
        <div class="col-md-4">
            <div class="card text-white bg-primary mb-3">
                <div class="card-body">
                    <h5 class="card-title">Total Utilisateurs</h5>
                    <p class="card-text">{{ $totalUsers }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-white bg-success mb-3">
                <div class="card-body">
                    <h5 class="card-title">Utilisateurs actifs</h5>
                    <p class="card-text">{{ $activeUsers }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
