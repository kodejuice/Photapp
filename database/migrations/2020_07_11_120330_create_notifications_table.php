<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->timestamps();
            $table->boolean('new')->default(1);
            $table->bigIncrements('notification_id');

            $table->enum('type', ['mention','comment','like','follow']);
            $table->string('message');
            $table->unsignedBigInteger('user_id'); // the user notified

            $table->unsignedBigInteger('post_id')->nullable();    // associated post
            $table->unsignedBigInteger('comment_id')->nullable(); // associated comment
            $table->string('associated_user')->nullable();        // associated user

            // index
            //
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('post_id')->references('post_id')->on('posts');
            $table->foreign('comment_id')->references('comment_id')->on('comments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
