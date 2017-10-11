<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = array(
        'id', 'sender_id', 'recipient_id', 'seen','message', 'offer_id', 'created_at');

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function offer()
    {
        return $this->belongsTo('App\Offer');
    }
}
