![image](https://user-images.githubusercontent.com/10195482/120231763-6a369180-c252-11eb-8d87-4759ed6f35f7.png)

---

# Firebase rules coverage ![Cloud Firestore (4- Icon, Use in Firebase Contexts Only)](https://user-images.githubusercontent.com/10195482/120106635-2d896e00-c15e-11eb-9cbd-b25a858c6b48.png)

If you've ever wondered if you tested all your rules and conditions?

The Firebase emulators [1] already generate [test reports] that provide you with insights how the rules were evaluated, but this report is not compatible with standard code coverage reports.

This package aims to bridge this gap and converts the official Firebase test report to a standard LCOV file.

*[1] The storage emulator does not provide a test report, yet. Hopefully it will do it as well.*

---

## Installation

The `@simpleclub/firebase-rules-coverage` package is available on NPM (also GitHub Packages):

```shell
$ npm install --save @simpleclub/firebase-rules-coverage
```

Via Yarn:

```shell
$ yarn add @simpleclub/firebase-rules-coverage
```

## Usage

When installing the package the command `firebase-rules-coverage` will be added to your project.

You can use this command in the `package.json`-scripts or by executing `./node_modules/.bin/firebase-rules-coverage`.

The command takes a Firebase coverage JSON file and coverts that file into an LCOV coverage file (which can be uploaded to any coverage tool):

```shell
$ firebase-rules-coverage <input>
```

### Options

You can configure the behaviour of the command with the following options:

| Option             | Description                                             |
| ------------------ | ------------------------------------------------------- |
| --rules-file, -r   | Where the rules file can be found that was analyzed.    |
| --output, -o       | Where the coverage file should be saved.                |
| --project-root, -p | The root directory of the project.<br><br>You can use this if the script is run in a sub-directory of your repo. If omitted the current working directory is assumed to be the project root. |

### Examples

```shell
$ firebase-rules-coverage firestore-coverage.json --rules-file firestore.rules --output coverage
$ firebase-rules-coverage firestore-coverage.json --rules-file firestore.rules --output coverage --project-root ../..
$ firebase-rules-coverage storage-coverage.json --rules-file storage.rules --output coverage
```

---

## High-level setup

Write your security rules tests as described on the official documentation: [Firebase rules testing]

In your tests add this code snippet to be run after all your tests. 
This will save a coverage file that we will in a later step transform into an LCOV file: 

```ts
const PROJECT_ID = "firestore-emulator-example";
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage`;

after(async () => {
  // Write the coverage report to a file
  const coverageFile = 'firestore-coverage.json';
  const fstream = fs.createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
      http.get(COVERAGE_URL, (res) => {
        res.pipe(fstream, { end: true });

        res.on("end", resolve);
        res.on("error", reject);
      });
  });
});
```

After your tests are run you can then execute this command which will generate the LCOV report:

```shell
$ firebase-rules-coverage firestore-coverage.json --rules-file firestore.rules --output coverage
```

To automatically generate the LCOV file you can add a script to your `package.json` liek this:

```json
{
  ...
  "scripts": {
    ...
    "posttest": "firebase-rules-coverage firestore-coverage.json --rules-file firestore.rules --output coverage",
    "test": "mocha",
    ...
  },
  ...
}
```

[test reports]: https://firebase.google.com/docs/firestore/security/test-rules-emulator#generate_test_reports
[Firebase rules testing]: https://firebase.google.com/docs/firestore/security/test-rules-emulator
