<?php

namespace App\Http\Controllers;

use App\Models\NavRole;
use App\Http\Requests\StoreNavRoleRequest;
use App\Http\Requests\UpdateNavRoleRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NavRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNavRoleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(NavRole $navRole)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNavRoleRequest $request, NavRole $navRole)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NavRole $navRole)
    {
        //
    }

    public function getNavItemsByRole()
    {
        // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
        $roleId = Auth::check() ? Auth::user()->role_id : 4; // Ha nincs bejelentkezett felhasználó, akkor vendég szerepkör (role_id = 4)
        
        // Lekérjük a menüpontokat a megadott szerepkörhöz
        $navItems = DB::table('nav_roles')
            ->join('navs', 'navs.id', '=', 'nav_roles.nav_id')
            ->where('nav_roles.role_id', $roleId)
            ->orderBy('nav_roles.sorszam')
            ->select('navs.megnevezes', 'navs.url', 'componentName')
            ->get();

        return response()->json($navItems)->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
}
