<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('email');
            $table->string('username');
            $table->string('full_name');
            $table->string('password');

            $table->date('dob')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_pic')->nullable();
            $table->timestamp('email_verified_at')->nullable();

            $table->unsignedBigInteger('follows')->default(0);
            $table->unsignedBigInteger('followers')->default(0);
            $table->unsignedBigInteger('posts_count')->default(0);

            $table->rememberToken();

            // index
            //
            $table->unique('email');
            $table->unique('username');
        });

        // add fulltext index
        DB::statement('ALTER TABLE users ADD FULLTEXT fulltext_index (username, full_name)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
