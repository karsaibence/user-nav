<?php

namespace App\Http\Controllers;

use App\Models\NavRole;
use App\Http\Requests\StoreNavRoleRequest;
use App\Http\Requests\UpdateNavRoleRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
    public function update(Request $request, NavRole $navRole) {}

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
        // Lekérjük a menüpontokat és szerepköröket az adatbázisból, a megfelelő kapcsolatokat kezelve
        $navItems = DB::table('nav_roles')
            ->join('navs', 'navs.id', '=', 'nav_roles.nav_id')
            ->join('roles', 'roles.id', '=', 'nav_roles.role_id')
            ->orderBy('nav_roles.sorszam')
            ->select('nav_roles.id', 'roles.megnevezes as role_name', 'navs.megnevezes as nav_name', 'navs.id as nav_id', 'roles.id as role_id', 'nav_roles.sorszam')
            ->get();

        return response()->json($navItems)->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    public function updateNavOrder(Request $request)
    {
        // Kezdjük el a tranzakciót
        DB::beginTransaction();

        try {
            $items = $request->input('items');
            if (!$items) {
                return response()->json(['error' => 'No items provided'], 400);
            }

            // 1. Módosítsuk a sorszámokat, és frissítsük az adatokat
            foreach ($items as $index => $item) {
                if (!isset($item['id']) || !isset($item['sorszam'])) {
                    return response()->json(['error' => 'Missing "id" or "sorszam" key in item'], 400);
                }

                // A sorszám újra kiadása, hogy a helyes sorrendben legyenek
                DB::table('nav_roles')
                    ->where('id', $item['id'])
                    ->update(['sorszam' => $index + 1]); // Az index alapján módosítjuk a sorszámot
            }

            // Ha minden rendben van, akkor commit-áljuk a tranzakciót
            DB::commit();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            // Hiba esetén visszavonjuk a tranzakciót
            DB::rollBack();
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}
