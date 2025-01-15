<?php

namespace App\Http\Controllers;

use App\Models\Nav;
use App\Http\Requests\StoreNavRequest;
use App\Http\Requests\UpdateNavRequest;
use App\Services\NavService;
use Illuminate\Support\Facades\Request;

class NavController extends Controller
{
    
    protected $navService;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Nav::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Nav $nav)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nav $nav)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nav $nav)
    {
        //
    }

    public function __construct(NavService $navService)
    {
        $this->navService = $navService;
    }

    public function insertMenu(Request $request)
    {
        // Paraméterek a frontendről
        $targetSorszam = $request->input('sorszam');  // A kívánt sorszám
        $newParent = $request->input('parent');  // Az új menüpont ID-ja
        $roleId = $request->input('role_id');  // A szerepkör ID-ja
        $newNavId = $request->input('nav_id');  // Az új menüpont ID-ja

        // Validáljuk, hogy minden szükséges adat rendelkezésre áll
        $request->validate([
            'sorszam' => 'required|integer',
            'parent'=> 'required|integer',
            'role_id' => 'required|integer|exists:roles,id',
            'nav_id' => 'required|integer|exists:nav,id',
        ]);

        // Új menüpont hozzáadása a kívánt helyre
        $this->navService->insertNavAtPosition( $targetSorszam, $newParent, $roleId, $newNavId);

        return response()->json(['message' => 'Menüpont sikeresen hozzáadva']);
    }

    public function deleteMenu(Request $request)
    {
        // Paraméterek a frontendről
        $roleId = $request->input('role_id');  // A szerepkör ID-ja
        $targetSorszam = $request->input('sorszam');  // A törlendő menüpont sorszáma

        // Validáljuk, hogy minden szükséges adat rendelkezésre áll
        $request->validate([
            'role_id' => 'required|integer|exists:roles,id',
            'sorszam' => 'required|integer',
        ]);

        // Menüpont törlése
        $this->navService->deleteNavAtPosition($roleId, $targetSorszam);

        return response()->json(['message' => 'Menüpont sikeresen törölve']);
    }
}

