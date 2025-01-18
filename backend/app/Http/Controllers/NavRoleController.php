<?php

namespace App\Http\Controllers;

use App\Models\NavRole;
use App\Http\Requests\StoreNavRoleRequest;
use App\Http\Requests\UpdateNavRoleRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

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
    public function update(Request $request, NavRole $navRole)
    {
        
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

    public function getNavItemsWithRoles()
{
    // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
    $roleId = Auth::check() ? Auth::user()->role_id : 4; // Ha nincs bejelentkezett felhasználó, akkor vendég szerepkör (role_id = 4)
    
    // Lekérjük a menüpontokat és szerepköröket az adatbázisból, a megfelelő kapcsolatokat kezelve
    $navItems = DB::table('nav_roles')
        ->join('navs', 'navs.id', '=', 'nav_roles.nav_id')
        ->join('roles', 'roles.id', '=', 'nav_roles.role_id')
        ->where('nav_roles.role_id', $roleId)
        ->orderBy('nav_roles.sorszam')
        ->select('roles.megnevezes as role_name', 'navs.megnevezes as nav_name', 'navs.id as nav_id', 'roles.id as role_id', 'nav_roles.sorszam')
        ->get();

    return response()->json($navItems)->header('Cache-Control', 'no-cache, no-store, must-revalidate');
}

    public function updateNavOrder(Request $request)
{
    DB::beginTransaction();

    try {
        $items = $request->input('items'); // Az új sorrend

        // 1. Először frissítjük a sorszámokat, hogy ne legyenek ütközések.
        foreach ($items as $item) {
            // 1. Frissítjük a kívánt elem sorszámát
            DB::table('nav_roles')
                ->where('role_id', $item['role_id'])
                ->where('nav_id', $item['nav_id'])
                ->update(['sorszam' => $item['sorszam']]);
        }

        // 2. Eltoljuk a többi rekord sorszámát, amelyek az új pozíciótól nagyobbak.
        foreach ($items as $item) {
            DB::table('nav_roles')
                ->where('role_id', $item['role_id'])
                ->where('sorszam', '>=', $item['sorszam'])
                ->increment('sorszam', 1); // Növeljük az összes sorszámot, amely nagyobb vagy egyenlő a kívánt sorszámmal
        }

        DB::commit();
        return response()->json(['message' => 'Sorrend sikeresen frissítve!']);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



}
