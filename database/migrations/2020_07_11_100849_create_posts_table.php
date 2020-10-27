<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->timestamps();
            $table->bigIncrements("post_id");
            $table->unsignedBigInteger("user_id");

            $table->text("post_url");               // json string -> "[[file_name, full_file_path], ...]"
            $table->text('media_type');             // json string -> "[type1, type2, ...]"  where `typeN` = 'video'|'image'

            $table->text("caption") -> nullable();
            $table->text("tags") -> nullable();     // json string -> "['tag1', 'tag2', ...]"
            $table->text("mentions") -> nullable(); // json string -> "['user1', 'user2', ...]"
            $table->boolean('reposted')->default(0);

            $table->bigInteger("like_count")->default(0);
            $table->bigInteger("comment_count")->default(0);

            // index
            //
            $table->foreign('user_id')->references('id')->on('users');
        });

        // add fulltext index
        DB::statement('ALTER TABLE posts ADD FULLTEXT mentions (mentions)');
        DB::statement('ALTER TABLE posts ADD FULLTEXT fullsearch (caption, tags)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
