<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\NavRoleController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminRole;
use App\Http\Middleware\LoadNavigation;
use App\Http\Middleware\OrvosRole;
use App\Http\Middleware\PaciensRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', AdminRole::class])
    ->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
    });

Route::middleware(['auth:sanctum', OrvosRole::class])
    ->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
    });

Route::middleware(['auth:sanctum', PaciensRole::class])
    ->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
    });


Route::middleware([LoadNavigation::class])->group(function () {
    Route::get('/navigation', function (Request $request) {
        return response()->json($request->get('navigation'));
    });
});

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::get('/nav-items', [NavRoleController::class, 'getNavItemsByRole']);
