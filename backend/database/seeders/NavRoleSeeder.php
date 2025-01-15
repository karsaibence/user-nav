<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavRoleSeeder extends Seeder
{
    public function run()
    {
        // Guest szerepkör (role_id = 4) alap menüpontok
        $guestRoleId = 4; // Vendég szerepkör ID-ja
        $sorszam = 1;

        // Főoldal menüpont (id: 1)
        DB::table('nav_roles')->insert([
            'sorszam' => $sorszam++,
            'parent' => null, // nincs szülő menüpont
            'role_id' => $guestRoleId,
            'nav_id' => 1, // Főoldal menüpont id-je
        ]);

        // Bejelentkezés menüpont (id: 2)
        DB::table('nav_roles')->insert([
            'sorszam' => $sorszam++,
            'parent' => null, // nincs szülő menüpont
            'role_id' => $guestRoleId,
            'nav_id' => 2, // Bejelentkezés menüpont id-je
        ]);

        // Regisztráció menüpont (id: 3)
        DB::table('nav_roles')->insert([
            'sorszam' => $sorszam++,
            'parent' => null, // nincs szülő menüpont
            'role_id' => $guestRoleId,
            'nav_id' => 3, // Regisztráció menüpont id-je
        ]);

        DB::table('nav_roles')->insert([
            'sorszam' => $sorszam++,
            'parent' => null, // nincs szülő menüpont
            'role_id' => 3,
            'nav_id' => 9, // Regisztráció menüpont id-je
        ]);

        DB::table('nav_roles')->insert([
            'sorszam' => $sorszam++,
            'parent' => null, // nincs szülő menüpont
            'role_id' => 2,
            'nav_id' => 9, // Regisztráció menüpont id-je
        ]);
        // Admin szerepkör menüpontjai (role_id = 1) - MINDEN MENÜPONT HOZZÁADÁSA
        $adminRoleId = 1; // Admin szerepkör ID-ja

        // Lekérjük az összes menüpontot a nav táblából
        $navItems = DB::table('navs')->get();

        // Iterálunk a menüpontokon és hozzárendeljük őket az admin szerepkörhöz
        foreach ($navItems as $navItem) {
            DB::table('nav_roles')->insert([
                'sorszam' => $sorszam++,
                'parent' => $navItem->parent ?? null, // Ha van szülő menüpont, hozzárendeljük, egyébként null
                'role_id' => $adminRoleId,
                'nav_id' => $navItem->id, // Menüpont ID-ja
            ]);
        }
    }
}
