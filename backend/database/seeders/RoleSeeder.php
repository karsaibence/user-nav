<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->insert([
            ['megnevezes' => 'Admin', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Orvos', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Páciens', 'created_at' => now(), 'updated_at' => now()],
            ['megnevezes' => 'Vendég', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
