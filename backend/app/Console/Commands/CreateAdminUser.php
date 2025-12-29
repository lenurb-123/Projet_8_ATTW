<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create 
                            {email : L\'email de l\'administrateur}
                            {password : Le mot de passe}
                            {--first_name= : Le prénom}
                            {--last_name= : Le nom}
                            {--phone=+00000000000 : Le téléphone}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Créer un compte administrateur';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');
        $firstName = $this->option('first_name') ?? 'Admin';
        $lastName = $this->option('last_name') ?? 'Principal';
        $phone = $this->option('phone') ?? '+00000000000';

        // Validation
        $validator = Validator::make([
            'email' => $email,
            'password' => $password,
        ], [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            $this->error('Erreurs de validation :');
            foreach ($validator->errors()->all() as $error) {
                $this->error('- ' . $error);
            }
            return 1;
        }

        // Création de l'administrateur
        $admin = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
            'phone' => $phone,
            'profession' => 'Administrateur',
            'secteur' => 'Administration',
            'newsletter_subscribed' => false,
        ]);

        $this->info('✓ Compte administrateur créé avec succès !');
        $this->info('');
        $this->info("Email: {$admin->email}");
        $this->info("Nom: {$admin->first_name} {$admin->last_name}");
        $this->info("ID: {$admin->id}");

        return 0;
    }
}
