<?php

namespace App\Services;

use App\Models\NavRole;

class NavService
{
    /**
     * Új menüpontot beszúrni a kívánt sorszámra.
     *
     * @param int $roleId A szerepkör ID-ja (pl. admin, guest)
     * @param int $targetSorszam A kívánt sorszám, ahova a menüpontot szeretnéd helyezni
     * @param int $newNavId Az új menüpont ID-ja
     * @return void
     */
    public function insertNavAtPosition(int $roleId, int $targetSorszam, int $newNavId)
    {
        // 1. lépés: Növeljük a sorszámokat az összes menüpont után, hogy helyet biztosítsunk az új menüpontnak
        NavRole::where('role_id', $roleId)
            ->where('sorszam', '>=', $targetSorszam)
            ->increment('sorszam');

        // 2. lépés: Az új menüpontot a kívánt helyre illesztjük be
        NavRole::create([
            'role_id' => $roleId,
            'nav_id' => $newNavId,
            'sorszam' => $targetSorszam, // A kívánt pozíció
            'parent' => 0, // Szülőelem, ha van, akkor módosítani kell
        ]);
    }

    /**
     * Menüpont törlése és a következő menüpontok sorszámának csökkentése.
     *
     * @param int $roleId A szerepkör ID-ja (pl. admin, guest)
     * @param int $targetSorszam A törlendő menüpont sorszáma
     * @return void
     */
    public function deleteNavAtPosition(int $roleId, int $targetSorszam)
    {
        // 1. lépés: Töröljük a menüpontot
        NavRole::where('role_id', $roleId)
            ->where('sorszam', $targetSorszam)
            ->delete();

        // 2. lépés: Csökkentjük a sorszámot az összes menüpont után
        NavRole::where('role_id', $roleId)
            ->where('sorszam', '>', $targetSorszam)
            ->decrement('sorszam');
    }
}

