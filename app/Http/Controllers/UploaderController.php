<?php
    /**
     * Copyright (C) 2017  Born4Code Sp. z o.o.
     */
    
    namespace App\Http\Controllers;
    
    use Illuminate\Http\Request;
    use Image;
    use Validator;
    
    /**
     * Class UploaderController
     *
     * @author     : Jakub Socha <j.socha@born4code.pl>
     * @copyright  : 2017 Born4Code Sp. z o.o.
     * @link       : https://born4code.pl
     * @version    : 1.0.0
     * @package    : App\Http\Controllers
     */
    final class UploaderController extends Controller
    {
        /**
         * Wgrywanie obrazka powiadomienia
         *
         * @param Request $request
         *
         * @return \Illuminate\Http\JsonResponse
         */
        final public function uploadAction(Request $request)
        {
            $messages = [
                'file.required'      => 'Podaj nazwę strony',
                'file.image'     => 'Akceptujemy wyłącznie obrazki',
                'file.mimes'     => 'Akceptujemy wyłącznie obrazki JPG, JPEG lub PNG',
                'file.max'         => 'Maksymalna wielkość 1MB'
            ];

            $validator = Validator::make($request->all(), [
                'file'   => 'required|image|max:10000|mimes:jpg,jpeg,png'
            ], $messages);

            if ($validator->fails()) {
                return response()->json([
                    'validatorError' => $validator->errors()
                ], 400);
            }

            $file = $request->file('file');

            $img = Image::make($request->file('file'));
            $img->fit(1200);

            $filename = str_random() . '.' . strtolower($file->getClientOriginalExtension());
            $directory = 'uploads/';
            $path = $directory.$filename;
            $img->save("$path");

            return response()->json([
                'success' => 'Dodano obrazek',
                'url' => env('APP_URL') . ':8000/' . $path
            ], 200);
        }
    }