<?php

namespace App\Http\Controllers;

use App\Message;
use App\User;
use App\Offer;

use Illuminate\Http\Request;
use Validator;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
            'sender_id.required' => 'Sender id is required',
            'recipient_id.required' => 'Recipient id is required',
            'offer_id.required' => 'Offer id is required'
        ];

        $validator = Validator::make($request->all(), [
            'sender_id' => 'required|integer',
            'recipient_id' => 'required|integer',
            'offer_id' => 'required|integer'
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validatorError' => $validator->errors()
            ],400);
        }

        $sender = User::where('id', '=', $request->input('sender_id'))->first();
        $recipient = User::where('id', '=', $request->input('recipient_id'))->first();
        if(!isset($sender) || !isset($recipient)) {
            return response()->json([
                'error' => 'Sender or recipient doesn\'t exist'
            ], 400);
        }
        $offer = Offer::where('id', '=', $request->input('offer_id'))->first();
        if(!isset($offer)) {
            return response()->json([
                'error' => 'Offer doesn\'t exist'
            ], 400);
        }

        $message = new Message;
        $message->sender_id = $sender->id;
        $message->recipient_id = $recipient->id;
        $message->offer_id = $offer->id;
        $message->message = 'Call me: ' . $sender->telephone;
        $message->save();

        return response()->json([
            'success' => 'Message added'
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $idUser
     * @return \Illuminate\Http\Response
     */
    public function showMessagesByUser($idUser)
    {
        $messages = Message::where('recipient_id', '=', $idUser)->get();
        if(!isset($messages)) {
            return response()->json([
                'error' => 'Messages for user doesn\'t exist'
            ], 400);
        }

        return response()->json([
            'offers' => $messages
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $idMessage
     * @return \Illuminate\Http\Response
     */
    public function updateSeen($idMessage)
    {
        $message = Message::where('id', '=', $idMessage)->first();
        if(!isset($message)) {
            return response()->json([
                'error' => 'Message doesn\'t exist'
            ], 400);
        }
        $message->seen = true;
        $message->update();

        return response()->json([
            'success' => 'Message seen: true'
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
        $message = Message::where('id', '=', $id);
        if(!$message) {
            return response()->json([
                'error' => 'Message doesn\'t exist'
            ], 400);
        }
        $message->delete();

        return response()->json([
            'success' => 'Message deleted'
        ], 200);
    }
}
