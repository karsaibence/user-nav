<?php

namespace App\Http\Middleware;

use App\Models\Nav;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LoadNavigation
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $roleId = Auth::check() ? Auth::user()->role_id : 4; // 4 = Vendég szerepkör
        $navigation = Nav::table('navs')
            ->join('nav_role', 'nav.id', '=', 'nav_role.nav_id')
            ->where('nav_role.role_id', $roleId)
            ->orderBy('nav_role.sorszam')
            ->get(['nav.megnevezes', 'nav.url']);

        // Hozzáadás a kéréshez
        $request->merge(['navigation' => $navigation]);

        return $next($request);
    }
}
