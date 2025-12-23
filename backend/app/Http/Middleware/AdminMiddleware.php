<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return redirect('/login')->with('error', 'Accès réservé aux administrateurs');
    }
}
