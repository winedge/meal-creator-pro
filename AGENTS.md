# Architecture rules

- Keep the Meta Pixel base loader in the document HTML, and invoke it only from the shared tracking library after permission and saved settings checks; this exposes the setup in page source without bypassing regional blocking or duplicating Pixel installs.