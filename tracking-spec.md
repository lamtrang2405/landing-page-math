# GA4 Tracking Spec

## Scope

This document defines the GA4 tracking taxonomy for the landing page, including required parameters and reporting examples.

## Naming Convention

- Use `snake_case` for all event names and parameters.
- One behavior should map to one primary event to avoid double counting.
- Specialized events (`phone_click`, `zalo_click`, `form_submit`, `scroll_90`) must not also fire `cta_click` for the same user action.
- Add shared context to every event when possible:
  - `page_title`
  - `page_path`

## Event Catalog

### `page_ready`

- **Trigger**: once when the page JS tracking is initialized.
- **Required params**:
  - `page_location`
- **Auto context**:
  - `page_title`
  - `page_path`
- **Purpose**: baseline session/page load marker.

### `engagement_time_bucket`

- **Trigger**: when active tab time crosses a bucket.
- **Buckets**: `15`, `30`, `60`, `120` seconds.
- **Required params**:
  - `seconds`
- **Purpose**: engagement quality by time spent.

### `scroll_depth`

- **Trigger**: when reaching depth marks.
- **Marks**: `25`, `50`, `75`, `90`.
- **Required params**:
  - `percent`
- **Purpose**: section-level reading depth distribution.

### `scroll_90`

- **Trigger**: exactly when 90% page depth is reached.
- **Required params**:
  - `percent` (fixed to `90`)
- **Purpose**: high-intent consumption KPI (deep read).

### `cta_click`

- **Trigger**: generic CTA clicks that are not specialized contact events.
- **Required params**:
  - `button_text`
  - `button_type` (`message`, `contact`, `other`)
  - `destination` (normalized destination: `phone`, `email`, `zalo`, `facebook`, or URL/hash)
  - `section` (closest section id)
- **Purpose**: unified CTA performance view without overlap.

### `phone_click`

- **Trigger**: click on links with `href` starting with `tel:`.
- **Required params**:
  - `button_text`
  - `section`
- **Purpose**: phone call intent tracking.

### `zalo_click`

- **Trigger**: click on links containing `zalo.me`.
- **Required params**:
  - `button_text`
  - `section`
- **Purpose**: Zalo chat intent tracking.

### `form_submit`

- **Trigger**:
  - native HTML form submit (`<form>` submit event), or
  - chat lead actions treated as a submit (Messenger/Zalo).
- **Required params**:
  - `form_name`
  - `method` (`native_submit`, `messenger`, `zalo`)
  - `source`
- **Purpose**: lead generation conversion event.

### `tab_click`

- **Trigger**: tab navigation clicks (course details / analysis tabs).
- **Required params**:
  - `tab_index`
- **Recommended params**:
  - `tab_root`
  - `tab_label`
- **Purpose**: content interest mapping by tab.

### `purchase_success`

- **Trigger**: successful purchase callback (`window.trackPurchaseSuccess`).
- **Required params**:
  - `value`
  - `currency`
  - `plan`
  - `payment_method`
- **Purpose**: revenue and package performance.

## Deduplication Rules

- If action is Zalo click:
  - fire `zalo_click`
  - fire `form_submit` with `method: zalo`
  - do not fire `cta_click`
- If action is Phone click:
  - fire `phone_click`
  - do not fire `cta_click`
- If action is Messenger chat click:
  - fire `form_submit` with `method: messenger`
  - do not fire `cta_click`

## Example Reports (GA4 Explorations)

### 1) CTA Performance

- **Rows**: `event_name`, `button_text`, `section`
- **Filter**: `event_name = cta_click`
- **Metrics**: Event count, Users
- **Use case**: compare non-contact CTA effectiveness.

### 2) Contact Intent Funnel

- **Rows**: `event_name`, `method`, `section`
- **Filter**: `event_name in (phone_click, zalo_click, form_submit)`
- **Metrics**: Event count, Users
- **Use case**: compare contact channel preference.

### 3) Deep Reader Conversion

- **Rows**: `event_name`
- **Filter**: `event_name in (scroll_90, form_submit, purchase_success)`
- **Metrics**: Event count, Total users, Conversion rate (custom)
- **Use case**: measure how deep reading correlates with lead/purchase.

### 4) Engagement Quality

- **Rows**: `seconds`
- **Filter**: `event_name = engagement_time_bucket`
- **Metrics**: Event count, Users
- **Use case**: identify time thresholds with strongest conversion lift.

## QA Checklist

- Confirm events in GA4 DebugView while clicking:
  - Zalo button
  - Phone link
  - Generic CTA
- Verify no duplicate pair for one click:
  - `zalo_click` + `cta_click` should never appear together for same action
  - `phone_click` + `cta_click` should never appear together for same action
- Validate required params exist for each event in DebugView.
