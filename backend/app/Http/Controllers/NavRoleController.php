<?php

namespace App\Http\Controllers;

use App\Models\NavRole;
use App\Http\Requests\StoreNavRoleRequest;
use App\Http\Requests\UpdateNavRoleRequest;
use App\Models\Nav;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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

    public function checkNavAssignedToRole(Request $request)
    {
        $validated = $request->validate([
            'nav_id' => 'required|integer|exists:navs,id',  // Validáció, hogy a nav_id létezzen a navs táblában
            'role_name' => 'required|string',  // Validáljuk a role_name-t
        ]);

        // A role_id-t a role_name alapján
        $role = Role::where('megnevezes', $validated['role_name'])->first();

        // Ha nem találjuk a szerepkört
        if (!$role) {
            return response()->json(['error' => 'Role not found.'], 404);
        }

        // Ellenőrizzük, hogy a nav_id és role_id páros már létezik
        $exists = NavRole::where('nav_id', $validated['nav_id'])
            ->where('role_id', $role->id)
            ->exists();

        // Visszaadjuk az eredményt
        return response()->json(['exists' => $exists]);
    }

    public function addNavToRole(Request $request)
    {
        // Validáljuk a bemeneti adatokat
        $validated = $request->validate([
            'nav_id' => 'required|integer|exists:navs,id',  // Validáció, hogy a nav_id létezzen a navs táblában
            'role_name' => 'required|string',  // Validáljuk a role_name-t
        ]);

        // A role_name alapján megszerezzük a role_id-t
        $role = Role::where('megnevezes', $validated['role_name'])->first();

        // Ha nem találunk ilyen role-t, hibát jelezünk
        if (!$role) {
            return response()->json(['error' => 'Role not found.'], 404);
        }

        // Ha a role_id megvan, akkor folytatjuk az adatbázis műveleteket
        $navRole = new NavRole();
        $navRole->nav_id = $validated['nav_id'];
        $navRole->role_id = $role->id;  // A role_id hozzárendelése a role_name alapján
        $navRole->parent = null;  // Beállítjuk a parent mezőt (ha szükséges, itt kezelhetjük)

        // A legmagasabb sorszám +1 beállítása
        $maxSorszam = NavRole::where('role_id', $role->id)->max('sorszam');
        $navRole->sorszam = $maxSorszam + 1;

        // Mentjük az új NavRole rekordot
        $navRole->save();

        return response()->json($navRole);
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
