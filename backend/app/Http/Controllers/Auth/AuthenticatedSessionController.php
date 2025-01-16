<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'status' => 'Login successful',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    /*public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout successful']);
    }*/
    public function destroy(Request $request)
    {
        /*
        // A felhasználó autentikálása, hogy tudjuk, melyik tokent töröljük
        $user = Auth::user();

        // Ha léteznek személyes hozzáférési tokenek, töröljük őket
        if ($user) {
            // Az összes személyes hozzáférési tokent töröljük
            $user->tokens->each(function ($token) {
                $token->delete(); // Töröljük a megfelelő tokeneket
            });
            Cookie::forget('XSRF-TOKEN');
            Cookie::forget('sanctum');
        }


        // Válasz visszaküldése
        return response()->json(['message' => 'Successfully logged out']);
        */

        // Törli az összes token-t, amivel a felhasználó be van jelentkezve
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
