# MPH OS privacy policy

_Last updated: November 22, 2026_

MPH OS is a home screen for Android in-car displays. It is built to work on your device, without accounts,
ads or tracking. This policy covers the MPH OS app from Google Play and from this repository's Releases.

## What stays on your device

Everything MPH OS records or reads is kept on your device and is never uploaded by MPH OS:

- **Car data** from your OBD-II adapter: gauges, trips, fuel economy, fill-ups, car health, trouble codes.
- **Your settings**: places (Home, Work, favorites), driver profiles, appearance, shortcuts.
- **Contacts, calendar and notifications** (now playing, next turn, messages, calls), read only to show them on
  screen while you drive. MPH OS does not store message contents.
- **Microphone** audio, used only when you tap the mic to dictate a reply or a music request. Speech is turned into
  text by your device's speech recognition service, under that service's own terms.
- **Camera** images, shown live on screen when you open the camera view. Nothing is recorded.

You can erase all of it by clearing MPH OS's storage or uninstalling the app.

## What leaves your device

- **Weather**: your approximate location (rounded to about 1 km) is sent to
  [Open-Meteo](https://open-meteo.com/en/terms) to get the forecast. No other data is sent with it.
- **Update checks** (the version from this repository only): the app asks GitHub whether a newer release exists.
  The Google Play version is updated by Google Play instead.
- **Links you tap**, such as opening Google Maps, Waze, a web search for a trouble code, or Ko-fi, open in those
  apps or your browser under their own privacy policies.

MPH OS has no analytics, no advertising, no crash reporting service and no accounts. We don't sell or share data.

## Permissions

Each permission is asked the first time you use the feature that needs it, and the feature simply stays off if
you decline:

| Permission | Used for |
| --- | --- |
| Location | Night mode at sunset, weather, and GPS speed for the driving lock when no OBD adapter is connected |
| Bluetooth | Connecting to your OBD-II adapter and recognizing which driver's phone is connected |
| Contacts, Phone | Favorites and one-tap calling |
| Calendar | Today's events with directions |
| Microphone | Dictated replies and "play something" requests |
| Camera | The live camera view |
| Notification access | Now playing, next turn, messages and calls on the dashboard |
| Do Not Disturb access | Optional driving mode |

## Children

MPH OS is meant for drivers and is not directed at children under 13.

## Changes and contact

If this policy changes, the new version will be posted here with a new date. Questions? Open an
[issue](https://github.com/alexgalicea/mph-os/issues).
