<?php

namespace App\Api;

use GuzzleHttp\Client;

class BlueskyApi
{
    private $client;
    private $username;
    private $appPassword;

    public function __construct($config)
    {
        $this->client = new Client(['base_uri' => $config['api_base_url']]);
        $this->username = $config['username'];
        $this->appPassword = $config['app_password'];
    }

    public function getUserData($username)
    {
        try {
            $response = $this->client->post('/com.atproto.session.create', [
                'json' => [
                    'identifier' => $this->username,
                    'password' => $this->appPassword
                ]
            ]);

            $authToken = json_decode($response->getBody(), true)['accessJwt'];

            $response = $this->client->get("/com.atproto.identity.resolveHandle?handle={$username}", [
                'headers' => ['Authorization' => "Bearer {$authToken}"],
            ]);

            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
