<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = array(
        'id', 'city', 'street', 'images', 'no_rooms', 'apartment_area', 'floors', 'balcony', 'description', 'status', 'price', 'user_id', 'created_at', 'updated_at', 'date_sale');

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function messages()
    {
        return $this->hasMany('App\Message');
    }
}
