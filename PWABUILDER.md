# PWABuilder — package oriz Play for stores

- Live URL: https://play.oriz.in
- Android package id: `in.oriz.play`
- Signing SHA-256: `0C:82:DB:11:57:7E:21:8D:62:1E:54:DF:3B:33:D1:29:6E:77:56:80:36:22:C1:99:36:DF:03:D3:6F:0D:30:36`

## Steps

PWABuilder.com -> enter URL `https://play.oriz.in` -> Package For Stores -> Android (use existing signing key, package `in.oriz.play`) / Windows / iOS.

`public/.well-known/assetlinks.json` already carries the Android TWA fingerprint above; served at https://play.oriz.in/.well-known/assetlinks.json for Digital Asset Links verification.
