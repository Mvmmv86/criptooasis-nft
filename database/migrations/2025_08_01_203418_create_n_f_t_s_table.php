<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('n_f_t_s', function (Blueprint $table) {
            $table->id();
            $table->string('uri');
            $table->string('image');
            $table->string('image_url');
            $table->string('name');
            $table->string('description');
            $table->json('attributes');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('n_f_t_s');
    }
};
