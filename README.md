# FitnessApp

This is a mobile application built with React Native and Expo with TypeScript, and it helps users track their fitness activities. The app integrates with Firebase for authentication and data storage.

## Technologies used

- **TypeScript**

- **React Native**

- **Expo**

- **Firebase Firestore / Firebase Authentication** 

- **React Navigation**

- **React Native Elements**

## Tests

Run the Jest suite with `npm test`. Generate a coverage report with `npm run test:coverage`.

The current tests cover registration validation and account-creation behavior, training-name validation, and creating a training list and adding an exercise.

## GitHub Actions

The CI workflow runs on every push and pull request. It installs dependencies from `package-lock.json`, runs the TypeScript check and Jest coverage suite, and uploads the coverage report as a downloadable workflow artifact. No GitHub secrets are required for these checks.
