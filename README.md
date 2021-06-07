![image](https://user-images.githubusercontent.com/10195482/120230643-14f98080-c250-11eb-827a-c85a4354763b.png)

---

# Firebase rules helper [![Coverage Status](https://coveralls.io/repos/github/simpleclub/firebase-rules-helper/badge.svg?branch=main)](https://coveralls.io/github/simpleclub/firebase-rules-helper?branch=main)
This repo contains a collection of packages aimed to make working with Firebase rules easier.

You can mix and match those packages as you wish.

For example, you can only use `@simpleclub/firebase-rules-coverage` to generate coverage reports, or only `@simpleclub/firebase-rules-generator` to split your rules across different files.  
Or you can also split your rules across different files and then generate coverage reports on those files.

---

## Firebase rules generator ![Cloud Firestore (4- Icon, Use in Firebase Contexts Only)](https://user-images.githubusercontent.com/10195482/120106635-2d896e00-c15e-11eb-9cbd-b25a858c6b48.png) ![Cloud Storage for Firebase (4- Icon, Use in Firebase Contexts Only)](https://user-images.githubusercontent.com/10195482/120106718-7ccf9e80-c15e-11eb-8bcf-beeb1da6e7d1.png)

In 2020, we faced with the increasing need for splitting rules across different files to improve the readability of our security rules.  
At that point we wrote a helper script to split rules across files and in a build step combine them into one file.

You can read our article about that here: [Imports for Firestore Security rules]

Now, we've abstracted it into a package and generate sourcemaps that can be used to match the built-file back to the source files.

For setup instructions and how to use it see: [Firebase rules generator]

--- 

## Firebase rules coverage ![Cloud Firestore (4- Icon, Use in Firebase Contexts Only)](https://user-images.githubusercontent.com/10195482/120106635-2d896e00-c15e-11eb-9cbd-b25a858c6b48.png)

If you've ever wondered if you tested all your rules and conditions?

The Firebase emulators [1] already generate [test reports] that provide you with insights how the rules were evaluated, but this report is not compatible with standard code coverage reports.

This package aims to bridge this gap and converts the official Firebase test report to a standard LCOV file.

For setup instructions and how to use it see: [Firebase rules coverage]

*[1] The storage emulator does not provide a test report, yet. Hopefully it will do it as well.*


[Imports for Firestore Security rules]: https://medium.com/firebase-developers/imports-for-firestore-security-rules-are-the-best-26f0770ad23c
[Firebase rules generator]: https://github.com/simpleclub/firebase-rules-helper/blob/main/firebase-rules-generator
[Firebase rules coverage]: https://github.com/simpleclub/firebase-rules-helper/blob/main/firebase-rules-coverage
[test reports]: https://firebase.google.com/docs/firestore/security/test-rules-emulator#generate_test_reports
