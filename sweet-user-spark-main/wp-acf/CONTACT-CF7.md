# Contact page — WordPress / ACF + Contact Form 7

Two separate jobs:

| Job | Tool | What you get |
| --- | --- | --- |
| Editable page copy | **ACF** on the Contact page | Header, info cards, topics, success text |
| Form submissions in WP | **Contact Form 7** + **Flamingo** | Inbox under Flamingo → Inbound Messages |

You do **not** need a custom PHP route. CF7 already exposes:

```
POST {VITE_WP_API_URL}/wp-json/contact-form-7/v1/contact-forms/{FORM_ID}/feedback
```

React posts `FormData` to that URL.

---

## Connect React (`.env`)

```
VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
VITE_WP_CONTACT_PAGE_ID=<contact-page-id>
VITE_WP_CONTACT_SLUG=contact
VITE_WP_CF7_FORM_ID=<cf7-numeric-form-id>
```

Find the CF7 numeric ID in the WP admin URL when editing the form:

`…/admin.php?page=wpcf7&post=123&action=edit` → **123**

Restart `npm run dev` after changing `.env`.

---

## 1. ACF page content (once)

1. Create a **Contact** page (slug `contact`). Note the page ID.
2. **Custom Fields → Tools → Import** `contact-acf-field-group.json`.
3. Location: **Page = Contact** (re-select after import if needed).
4. Enable **Show in REST API**.
5. Fill tabs → **Update**.
6. Set `VITE_WP_CONTACT_PAGE_ID`.

### Tabs

| Tab | Edits |
| --- | --- |
| **① Page header** | Kicker, title, description |
| **② Contact info** | Info cards + legal note |
| **③ Form topics & success** | Topic chips, success copy, submit label |

---

## 2. Contact Form 7 (submissions)

### Install plugins

1. **Contact Form 7** — form + REST endpoint  
2. **Flamingo** (by Takayuki Miyoshi) — **stores submissions in WP admin**  
   Without Flamingo, CF7 only emails you; you won’t see an inbox in the backend.

### Create the form

Contact → Contact Forms → Add New. Form template:

```
<label> Name
    [text* your-name] </label>

<label> Email
    [email* your-email] </label>

<label> Topic
    [text your-topic] </label>

<label> Message
    [textarea* your-message] </label>

[submit "Send message"]
```

Mail tab example:

- **To:** your inbox  
- **From:** `[your-name] <wordpress@yourdomain>`  
- **Subject:** `[your-topic] — contact from [your-name]`  
- **Body:** include `[your-name]`, `[your-email]`, `[your-topic]`, `[your-message]`

Save → copy numeric form ID → `VITE_WP_CF7_FORM_ID`.

Field names **must** match what React sends: `your-name`, `your-email`, `your-topic`, `your-message`.

### View submissions

**Flamingo → Inbound Messages**

---

## 3. Custom route? (usually not needed)

CF7’s built-in route is enough:

```
/wp-json/contact-form-7/v1/contact-forms/{id}/feedback
```

Only build a custom route if you need extra logic (CRM sync, spam checks, etc.). Example sketch:

```php
// theme functions.php or mu-plugin — optional, not required for CF7
add_action('rest_api_init', function () {
  register_rest_route('recura/v1', '/contact', [
    'methods'  => 'POST',
    'callback' => 'recura_contact_submit',
    'permission_callback' => '__return_true',
  ]);
});
```

Prefer CF7 + Flamingo for this site.

---

## 4. CORS (if browser blocks the POST)

If the React app origin differs from the WP host, allow it (adjust origin):

```php
// mu-plugins/recura-cors.php
add_action('rest_api_init', function () {
  remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
  add_filter('rest_pre_serve_request', function ($value) {
    $origin = get_http_origin();
    $allowed = [
      'http://192.168.1.112:8083',
      'http://localhost:8083',
      'http://127.0.0.1:8083',
    ];
    if ($origin && in_array($origin, $allowed, true)) {
      header('Access-Control-Allow-Origin: ' . $origin);
      header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
    return $value;
  });
}, 15);
```

---

## Mapping

| ACF | React `content` |
| --- | --- |
| `header.*` | `kicker`, `title`, `description` |
| `info_items[]` | `infoItems[]` (icon → Lucide) |
| `legal_note` | `legalNote` |
| `topics[].label` | `topics[]` |
| `success_title` / `success_body` | `successTitle` / `successBody` |
| `submit_label` | `submitLabel` |

| CF7 field | React form |
| --- | --- |
| `your-name` | Name |
| `your-email` | Email |
| `your-topic` | Selected topic chip |
| `your-message` | Message |
