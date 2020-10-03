<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->boolean('notify_post_likes')->default(1);
            $table->boolean('notify_comments_likes')->default(1);
            $table->boolean('notify_comments')->default(1);
            $table->boolean('notify_mentions')->default(1);
            $table->boolean('notify_follows')->default(1);

            // index
            //
            $table->foreign('user_id')->references('id')->on('users');
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_settings');
    }
}
