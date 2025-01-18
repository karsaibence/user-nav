<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         DB::statement("
            CREATE VIEW role_nav_view AS
            SELECT
                r.megnevezes AS role_name,
                n.megnevezes AS nav_name,
                nr.sorszam
            FROM
                roles r
            JOIN
                nav_roles nr ON r.id = nr.role_id
            JOIN
                navs n ON nr.nav_id = n.id
            ORDER BY
                r.megnevezes, nr.sorszam;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_nav_view');
    }
};
