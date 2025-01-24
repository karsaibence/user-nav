<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\NavController;
use App\Http\Controllers\NavRoleController;
use App\Http\Controllers\role_nav_viewController;
use App\Http\Controllers\RoleController;
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

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF token set'])->withCookie(cookie('XSRF-TOKEN', csrf_token()));
});


Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'destroy']);

Route::middleware(['auth:sanctum', AdminRole::class])
    ->group(function () {
        //Route::get('/admin/users', [UserController::class, 'index']);
        Route::get('/get-roles-nav', [role_nav_viewController::class, 'index']);
        Route::get('/roles', [RoleController::class, 'index']);
        Route::put('/update-nav', [NavRoleController::class, 'updateNavOrder']);
        Route::get('/get-nav-items-with-roles', [NavRoleController::class, 'getNavItemsWithRoles']);
        Route::get('/navs', [NavController::class, 'index']);
        Route::post('/add-nav-to-role', [NavRoleController::class, 'addNavToRole']);
        Route::post('/check-nav-assigned-to-role', [NavRoleController::class, 'checkNavAssignedToRole']);
        Route::delete('/remove-nav-from-role/{id}', [NavRoleController::class, 'destroy']);
        Route::get('/users', [UserController::class, 'getUsersAndRoles']);
        Route::put('/update-user-role/{id}', [UserController::class, 'userRoleUpdate']);
    });

Route::middleware(['auth:sanctum', OrvosRole::class])
    ->group(function () {
        //Route::get('/admin/users', [UserController::class, 'index']);
    });

Route::middleware(['auth:sanctum', PaciensRole::class])
    ->group(function () {
        //Route::get('/admin/users', [UserController::class, 'index']);
    });


Route::middleware([LoadNavigation::class])->group(function () {
    Route::get('/navigation', function (Request $request) {
        return response()->json($request->get('navigation'));
    });
});

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::get('/nav-items', [NavRoleController::class, 'getNavItemsByRole']);
