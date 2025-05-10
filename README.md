# Calorie Tracker

React / Material UI / Supabase app for tracking calorie intake. Written to provide a simpler way of tracking a calorie-only food intake log, prioritizing speed of data entry.

Features include:

* Logging of foods eaten, either:
  - Manual per-entry calorie amounts
  - Referencing pre-stored foods
* A personal food list, allowing either:
  - Fixed servings, eg: "one apple"
  - By-weight servings, based on calories per 100g, including a default serving
* Daily total calorie counts
* Per-day history view

# Development

To get set up locally:

* Check out the repository
* Run `npm install` to install dependencies
* Run `npx supabase db start` to setup a local supabase install
* Copy `env.local.example` to `env.local` and fill in config items as required
* Run `npm run dev`

# Known Issues

- Add here (but don't cause too many...)

# License

MIT
