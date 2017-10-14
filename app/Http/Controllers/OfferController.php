<?php

namespace App\Http\Controllers;

use App\Offer;

use Illuminate\Http\Request;
use Validator;
use SimpleXMLElement;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $offers = Offer::all();

        return response()->json([
            'offers' => $offers
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
        $messages = [
            'city.required' => 'Enter the city',
            'street.required' => 'Enter the name of street',
            'images.required' => 'Image is required',
            'no_rooms.required' => 'Enter the numbers of rooms',
            'apartment_area.required' => 'Enter apartment\'s area',
            'floors.required' => 'Enter floors',
            'description.required' => 'Enter description',
            'price.required' => 'Enter a price'
        ];

        $validator = Validator::make($request->all(), [
            'city' => 'required|string',
            'street' => 'required|string',
            'images' => 'required|url',
            'no_rooms' => 'required|integer',
            'apartment_area' => 'required|integer',
            'floors' => 'required|integer',
            'balcony' => 'boolean',
            'description' => 'required|string',
            'price' => 'required|regex:/^\d+(,\d{1,2})?$/',
            'user_id' => 'required|integer'
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validatorError' => $validator->errors()
            ],400);
        }

        $offer = new Offer;
        $offer->city = $request->input('city');
        $offer->street = $request->input('street');
        $offer->images = $request->input('images');
        $offer->no_rooms = $request->input('no_rooms');
        $offer->apartment_area = $request->input('apartment_area');
        $offer->floors = $request->input('floors');
        if($request->input('balcony')) {
            $offer->balcony = $request->input('balcony');
        }
        $offer->description = $request->input('description');
        $offer->price = $request->input('price');
        $offer->user_id = $request->input('user_id');
        $offer->save();

        return response()->json([
            'success' => 'Offer added'
        ], 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $idOffer
     * @return \Illuminate\Http\Response
     */
    public function show($idOffer)
    {
        $offer = Offer::where('id', '=', $idOffer)->first();
        if(!isset($offer)) {
            return response()->json([
                'error' => 'Offer doesn\'t exist'
            ], 400);
        }

        return response()->json([
            'offer' => $offer
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $idUser
     * @return \Illuminate\Http\Response
     */
    public function showOffersByUser($idUser)
    {
        $offers = Offer::where('user_id', '=', $idUser)->get();
        if(!isset($offers)) {
            return response()->json([
                'error' => 'Offers for user doesn\'t exist'
            ], 400);
        }

        return response()->json([
            'offers' => $offers
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $idOffer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $idOffer)
    {
        $messages = [
            'city.string' => 'The city must be characters in the range a-z',
            'street.string' => 'The name of street must be characters in the range a-az',
            'images.url' => 'Image must be a valid url',
            'no_rooms.integer' => 'The numbers of rooms must be digit/s',
            'apartment_area.integer' => 'Apartment\'s area must be digit/s',
            'floors.integer' => 'Floors must be a digit/s',
            'balcony.boolean' => 'Balcony must be YES/NO',
            'description.string' => 'Description must be characters in the range a-z ',
            'price.regex' => 'Price must be digits, example 120,50'
        ];

        $validator = Validator::make($request->all(), [
            'city' => 'string',
            'street' => 'string',
            'images' => 'url',
            'no_rooms' => 'integer',
            'apartment_area' => 'integer',
            'floors' => 'integer',
            'balcony' => 'boolean',
            'description' => 'string',
            'price' => 'regex:/^\d+(,\d{1,2})?$/'
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validatorError' => $validator->errors()
            ],400);
        }

        $offer = Offer::where('id', '=', $idOffer)->first();
        if(!isset($offer)) {
            return response()->json([
                'error' => 'Offer doesn\'t exist'
            ], 400);
        }
        $offer->update($request->all());

        return response()->json([
            'success' => 'Offer edit'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $idOffer
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, $idOffer)
    {
        $messages = [
            'status.required' => 'Status is required',
            'status.boolean' => 'Status is false or true'
        ];

        $validator = Validator::make($request->all(), [
            'status' => 'required|boolean'
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validatorError' => $validator->errors()
            ],400);
        }

        $offer = Offer::where('id', '=', $idOffer)->first();
        if(!isset($offer)) {
            return response()->json([
                'error' => 'Offer doesn\'t exist'
            ], 400);
        }
        $offer->status = $request->input('status');
        if($offer->status === false) {
            $offer->date_sale = date('Y-m-d');
        } else {
            $offer->date_sale = null;
        }
        $offer->update();

        return response()->json([
            'success' => 'Offer status and date_sale is updated'
        ], 200);
    }

    /**
     * Generate report.
     *
     * @param  int  $month
     * @param int $year
     * @return \Illuminate\Http\Response
     */
    public function generateReport($month, $year)
    {
        $offers = Offer::where('status', '=', false)
                      ->whereMonth('date_sale', '=', $month)
                      ->whereYear('date_sale', '=', $year)
                      ->get();

        return response()->json([
            'offers' => $offers
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $offer = Offer::where('id', '=', $id);
        if(!$offer) {
            return response()->json([
                'error' => 'Offer doesn\'t exist'
            ], 400);
        }
        $offer->delete();

        return response()->json([
            'success' => 'Offer deleted'
        ], 200);
    }
}
