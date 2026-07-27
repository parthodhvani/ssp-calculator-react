<?php
/**
 * Plugin Name: Recura CORS (headless React)
 * Description: Allows the React app origin to call WP REST + Contact Form 7 feedback.
 * Drop into wp-content/mu-plugins/recura-cors.php (create mu-plugins if missing).
 *
 * Edit $allowed to match your Vite/dev/production origins.
 */

add_action('rest_api_init', function () {
  remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
  add_filter('rest_pre_serve_request', function ($value) {
    $origin = get_http_origin();
    $allowed = [
      'http://192.168.1.112:8083',
      'http://localhost:8083',
      'http://127.0.0.1:8083',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

    if ($origin && in_array($origin, $allowed, true)) {
      header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
      header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
    }

    return $value;
  });
}, 15);

// Answer CF7 / REST preflight
add_action('init', function () {
  if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    return;
  }

  $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
  $allowed = [
    'http://192.168.1.112:8083',
    'http://localhost:8083',
    'http://127.0.0.1:8083',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  if ($origin && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
    header('Access-Control-Max-Age: 86400');
    status_header(200);
    exit;
  }
});
