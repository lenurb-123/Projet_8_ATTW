<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\UsersExport;

class AdminExportController extends Controller
{
    public function exportUsers(Request $request): JsonResponse
    {
        $format = $request->input('format', 'csv');
        $type = $request->input('type', 'all');

        $query = User::with(['category', 'professionalProfile']);

        if ($type !== 'all') {
            $query->where('status', $type);
        }

        $users = $query->get();

        if ($format === 'excel') {
            $filename = 'utilisateurs-' . date('Y-m-d') . '.xlsx';
            Excel::store(new UsersExport($users), $filename);

            return response()->json([
                'url' => url('storage/' . $filename),
                'message' => 'Export Excel généré'
            ]);
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('admin.exports.users_pdf', compact('users'));
            $filename = 'utilisateurs-' . date('Y-m-d') . '.pdf';
            $pdf->save(storage_path('app/public/' . $filename));

            return response()->json([
                'url' => url('storage/' . $filename),
                'message' => 'Export PDF généré'
            ]);
        }

        // CSV par défaut
        $filename = 'utilisateurs-' . date('Y-m-d') . '.csv';
        $this->generateCSV($users, $filename);

        return response()->json([
            'url' => url('storage/' . $filename),
            'message' => 'Export CSV généré'
        ]);
    }

    private function generateCSV($users, $filename): void
    {
        $file = fopen(storage_path('app/public/' . $filename), 'w');

        // En-têtes
        fputcsv($file, [
            'ID', 'Nom', 'Email', 'Rôle', 'Statut', 'Catégorie',
            'Date d\'inscription', 'Dernière connexion'
        ]);

        // Données
        foreach ($users as $user) {
            fputcsv($file, [
                $user->id,
                $user->first_name . ' ' . $user->last_name,
                $user->email,
                $user->role,
                $this->getStatusLabel($user->status),
                $user->category->name ?? 'Non catégorisé',
                $user->created_at->format('d/m/Y'),
                $user->last_login_at ? $user->last_login_at->format('d/m/Y H:i') : 'Jamais'
            ]);
        }

        fclose($file);
    }

    private function getStatusLabel($status): string
    {
        return match($status) {
            User::STATUS_ACTIVE => 'Actif',
            User::STATUS_PENDING => 'En attente',
            User::STATUS_INACTIVE => 'Inactif',
            User::STATUS_SUSPENDED => 'Suspendu',
            default => 'Inconnu'
        };
    }
}
