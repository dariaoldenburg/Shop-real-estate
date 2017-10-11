<?php

namespace App\Http\Controllers;

use App\User;

use Illuminate\Http\Request;
use Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  int  $idUser
     * @return \Illuminate\Http\Response
     */
    public function index($idUser)
    {
        $user = User::where('id', '=', $idUser)->first();
        if(!isset($user)) {
            return response()->json([
                'error' => 'User doesn\'t exist'
            ], 400);
        }
        $userRole = $user->role;
        if($userRole != 'admin') {
            return response()->json([
                'error' => 'User not is admin'
            ], 400);
        }

        $users = User::where('role', '!=', 'admin')->get();
        if(!isset($users)) {
            return response()->json([
                'error' => 'Users don\'t exist'
            ], 400);
        }

        return response()->json([
            'offers' => $users
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //+walidacja numeru
        $messages = [
            'email.required' => 'Enter email',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'Email is taken',
            'telephone.required' => 'Enter the phone number',
            'telephone.regex' => 'Please enter a valid phone number',
            'telephone.unique' => 'The phone number is taken',
            'password.required' => 'Enter the password',
            'password.confirmed' => 'The passwords are not identical',
            'password.min' => 'The password must be at least 8 characters.'

        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
            'telephone' => 'required|numeric|unique:users',
            'password' => 'required|confirmed|min:8',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validatorError' => $validator->errors()
            ],400);
        }

        $password = bcrypt($request->input('password'));
        $user = new User([
            'email' => $request->input('email'),
            'telephone' => $request->input('telephone'),
            'password' => $password
        ]);
        $user->save();

        return response()->json([
            'success' => 'User added'
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $idUser
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(Request $request, $idUser)
    {
        $messages = [
            'password.required' => 'Enter the password',
            'password.confirmed' => 'The passwords are not identical',
            'password.min' => 'The password must be at least 8 characters.'
        ];

        $validator = Validator::make($request->all(), [
            'password' => 'required|confirmed|min:8',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validatorError' => $validator->errors()
            ],400);
        }

        $user = User::where('id', '=', $idUser)->first();
        if(!isset($user)) {
            return response()->json([
                'error' => 'User doesn\'t exist'
            ], 400);
        }

        $user->password = bcrypt($request->input('password'));
        $user->update();

        return response()->json([
            'user' => 'Changed password'
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $idUser
     * @return \Illuminate\Http\Response
     */
    public function destroy($idUser)
    {
        $user = User::where('id', '=', $idUser)->first();
        if(!$user) {
            return response()->json([
                'error' => 'User doesn\'t exist'
            ], 400);
        }
        $user->delete();

        return response()->json([
            'success' => 'User deleted'
        ], 200);
    }
}
