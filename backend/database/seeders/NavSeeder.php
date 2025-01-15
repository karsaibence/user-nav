<?php

namespace Database\Seeders;

use App\Models\Nav;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('navs')->insert([
            ['megnevezes' => 'Bejelentkezés', 'url' => '/login', 'componentName' => 'Bejelentkezes', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Regisztráció', 'url' => '/register', 'componentName' => 'Regisztracio', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Főoldal', 'url' => '/', 'componentName' => 'Fooldal', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Kapcsolat', 'url' => '/contact', 'componentName' => 'Kapcsolat', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Doktorok', 'url' => '/doctors', 'componentName' => 'Doktorok', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Páciensek', 'url' => '/patients', 'componentName' => 'Paciensek', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Nav elemek', 'url' => '/navs', 'componentName' => 'NavElemek', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Felhasználók', 'url' => '/users', 'componentName' => 'Felhasznalok', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Kijelentkezés', 'url' => '/logout', 'componentName' => 'Kijelentkezes', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
