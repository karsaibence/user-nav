<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nav_roles', function (Blueprint $table) {
            $table->id();
            $table->integer('sorszam');
            $table->integer('parent')->nullable();
            $table->foreignId('role_id')->references('id')->on('roles');
            $table->foreignId('nav_id')->references('id')->on('navs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nav_roles');
    }
};
