![image](https://user-images.githubusercontent.com/10195482/120231727-525f0d80-c252-11eb-966f-32bbe17931e0.png)

---

# Firebase rules generator ![Cloud Firestore (4- Icon, Use in Firebase Contexts Only)](https://user-images.githubusercontent.com/10195482/120106635-2d896e00-c15e-11eb-9cbd-b25a858c6b48.png) ![Cloud Storage for Firebase (4- Icon, Use in Firebase Contexts Only)](https://user-images.githubusercontent.com/10195482/120106718-7ccf9e80-c15e-11eb-8bcf-beeb1da6e7d1.png)

In 2020, we faced with the increasing need for splitting rules across different files to improve the readability of our security rules.  
At that point we wrote a helper script to split rules across files and in a build step combine them into one file.

You can read our article about that here: [Imports for Firestore Security rules]

Now, we've abstracted it into a package and generate sourcemaps that can be used to match the built-file back to the source files.

See also [Firebase rules coverage] if you want to generate a test coverage report of your unit tests.

--- 

## Installation

The `firebase-rules-generator` package is available on NPM (also GitHub Packages): 

```shell
$ npm install --save firebase-rules-generator
```

Via Yarn:

```shell
$ yarn add firebase-rules-generator
```

## Usage

When installing the package the command `firebase-build-rules` will be added to your project.

You can use this command in the `package.json`-scripts or by executing `./node_modules/.bin/firebase-build-rules`.

The command takes an index rules files and may contain imports to other rules files:

```shell
$ firebase-build-rules <input>
```

### Options

You can configure the behaviour of the command with the following options:

| Option           | Description                                             |
| ---------------- | ------------------------------------------------------- |
| --output, -o     | Where the final rules file should be saved.             |
| --source-map, -s | Whether to generate source maps or not (default: true). |

### Examples

```shell
$ firebase-build-rules rules/index.rules --output firestore.rules
$ firebase-build-rules rules/index.rules --no-source-map --output storage.rules
 ```

## Import syntax

To get the most out of this package you need to understand how the imports work.

Let's take a simple example:

***index.rules***
```firebase_rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    include "matcher.rules";
  }
}
```

***matcher.rules***
```firebase_rules
match /articles/{article} {
  allow read: if request.auth != null;
  allow create, update: if request.auth.token.admin == true;
}
```

In this example we would use a command like this to generate the final rules file:

```shell
$ firebase-build-rules index.rules -o firestore.rules 
```

Because we have this `include "matcher.rules";` statement in there the rules-generator will pick this up and
include the contents from `matcher.rules` at the exact same position as the `include`-statement.

The final `firestore.rules` file will then look like:

```firebase_rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
match /articles/{article} {
  allow read: if request.auth != null;
  allow create, update: if request.auth.token.admin == true;
}
  }
}
```
*Indentation will not be perfect, but that does not matter for the Firebase rules engine.*

### Include vs import

Why is it called include and not import?

It's a relatively straight forward answer:  
Because the position where the `include`-statement is placed matters a lot in the built rules file.
This behavior is vastly different from imports you know from other programming languages where the order of imports does not matter too much.

[Imports for Firestore Security rules]: https://medium.com/firebase-developers/imports-for-firestore-security-rules-are-the-best-26f0770ad23c
[Firebase rules coverage]: https://github.com/simpleclub/firebase-rules-helper/blob/main/firebase-rules-coverage
