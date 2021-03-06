<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth.jwt')->group(function () {
    Route::get('/users/{user}', [
        'uses' => 'UserController@index'
    ]);
    Route::put('/users/{user}', [
        'uses' => 'UserController@updatePassword'
    ]);
    Route::delete('/users/{user}', [
        'uses' => 'UserController@destroy'
    ]);
    Route::put('/offers/{offer}', [
        'uses' => 'OfferController@update'
    ]);
    Route::put('/offers/{offer}/status', [
        'uses' => 'OfferController@updateStatus'
    ]);
    Route::delete('/offers/{offer}', [
        'uses' => 'OfferController@destroy'
    ]);
    Route::post('/offers', [
        'uses' => 'OfferController@store'
    ]);
    Route::get('/offers/{offer}', [
        'uses' => 'OfferController@show'
    ]);
    Route::get('/offers/user/{user}', [
        'uses' => 'OfferController@showOffersByUser'
    ]);
    Route::get('/offers/generateReport/{month}/{year}', [
        'uses' => 'OfferController@generateReport'
    ]);
    Route::post('/messages', [
        'uses' => 'MessageController@store'
    ]);
    Route::get('/messages/{user}', [
        'uses' => 'MessageController@showMessagesByUser'
    ]);
    Route::put('/messages/{message}', [
        'uses' => 'MessageController@updateSeen'
    ]);
    Route::delete('/messages/{message}', [
        'uses' => 'MessageController@destroy'
    ]);
    Route::post('/upload', [
        'uses' => 'UploaderController@uploadAction',
        'as'   => 'upload.action'
    ]);
});

Route::post('/register', [
    'uses' => 'UserController@store'
]);

Route::get('/offers', [
    'uses' => 'OfferController@index'
]);

Route::post('/authenticate', [
    'uses' => 'AuthenticateController@authenticate'
]);

Route::get('/authenticate/user', [
    'uses' => 'AuthenticateController@getAuthenticatedUser'
]);




