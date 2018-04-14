<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\File;

class CreateGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('groups', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('group');
            $table->text('sizes')->nullable(); //json não dpa certo na versão mysql
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
			//apaga o storage
			File::deleteDirectory(storage_path('dataview_/groups'));
			
			DB::statement('SET FOREIGN_KEY_CHECKS = 0');
			Schema::dropIfExists('groups');
			DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
}