<?php

namespace App\Models;

use App\Casts\ImageCast;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable, HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tw_user';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'gender',
        'dob',
        'country',
        'phonenumber',
        'loan',
        'img_loan',
        'fullname',
        'username',
        'cccd',
        'password',
        'paypassword',
        'cardzm',
        'cardfm',
        'rzstatus',
        'hy_result_mode',
        'level',
        'invit_1',
        'invit_2',
        'invit_3',
        'path',
        'logins',
        'addip',
        'addr',
        'addtime',
        'endtime',
        'lgtime',
        'loginip',
        'loginaddr',
        'logintime',
        'rztime',
        'rzuptime',
        'status',
        'wdstatus',
        'txstate',
        'invit',
        'stoptime',
        'is_agent',
        'kefu',
        'bank_name',
        'bank_acc_no',
        'bank_acc_name',
        'wallet',
        'money'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'paypassword',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'money' => 'decimal:2',
        'rzstatus' => 'integer',
        'hy_result_mode' => 'integer',
        'level' => 'integer',
        'invit_1' => 'integer',
        'invit_2' => 'integer',
        'invit_3' => 'integer',
        'logins' => 'integer',
        'status' => 'integer',
        'txstate' => 'integer',
        'is_agent' => 'integer',
        'kefu' => 'integer',
        'lgtime' => 'datetime',
        'logintime' => 'datetime',
        // 'cardzm' => ImageCast::class,
        // 'cardfm' => ImageCast::class,
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Hash the password before saving.
     *
     * @param string $password
     */
    public function setPasswordAttribute($password)
    {
        if ($password) {
            $this->attributes['password'] = md5($password);
        }
    }

    public function setPaypasswordAttribute($paypassword)
    {
        if ($paypassword) {
            $this->attributes['paypassword'] = md5($paypassword);
        }
    }
}