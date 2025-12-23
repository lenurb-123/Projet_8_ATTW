<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UsersExport;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportController extends Controller
{
    public function excel()
    {
        return Excel::download(new UsersExport, 'utilisateurs-' . date('Y-m-d') . '.xlsx');
    }

    public function pdf()
    {
        $users = User::with(['profile', 'category'])
            ->where('is_active', true)
            ->get();

        $pdf = Pdf::loadView('admin.exports.users_pdf', compact('users'));

        return $pdf->download('utilisateurs-' . date('Y-m-d') . '.pdf');
    }
}
