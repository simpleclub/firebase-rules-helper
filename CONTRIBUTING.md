# Contributing guide

This file outlines how you can contribute to `firebase-rules-coverage`, `firebase-rules-generator`, and other future packages in this repo.  
If you are new to contributing on GitHub, you might want to see the setup section below.

## Setting up your repo

### Fork the firebase-rules-helper repository

* Ensure you have configured an SSH key with GitHub; see [GitHub's directions][ssh key].
* Fork [this repository][repo] using the "Fork" button in the upper right corner of the GitHub page.
* Clone the forked repo: `git clone git@github.com:<your_github_user_name>/firebase-rules-helper.git`
* Navigate into the project: `cd firebase-rules-helper`
* Add this repo as a remote repository:
  `git remote add upstream git@github.com:simpleclub/firebase-rules-helper.git`

### Create pull requests

* Fetch the latest repo state: `git fetch upstream`
* Create a feature branch: `git checkout upstream/master -b <name_of_your_branch>`
* Install dependencies using `yarn install`. (See [installing yarn][yarn] for how to install yarn.)
* Now, you can change the code necessary for your patch.

  Make sure that you bump the version in `package.json` of all packages you've changes something. You **must** bump the package
  version when a new package version should be released and edit the `CHANGELOG.md` of all packages accordingly.  
  The version format needs to follow [semantic versioning][versioning]. Pay special attention when landing breaking changes.
* Commit your changes: `git commit -am "<commit_message>"`
* Push your changes: `git push origin <name_of_your_branch>`

After having followed these steps, you are ready to [create a pull request][create pr].  
The GitHub interface makes this very easy by providing a button on your fork page that creates
a pull request with changes from a recently pushed to branch.  
Alternatively, you can also use `git pull-request` via [GitHub hub][].

## Notes

* Always add tests or confirm that your code is working with current tests.
* Use `yarn fix` to format all code.
* Adhere to the lints, i.e. the warnings provided by ESLint based on the repo's lint rules.  
  Run `yarn lint` in order to ensure that you are not missing any warnings or errors.
* If you find something that is fundamentally flawed, please propose a better solution -
  we are open to complete revamps.

## Contributor License Agreement

We require contributors to sign our [Contributor License Agreement (CLA)][CLA].
In order for us to review and merge your code, please follow the link and sign the agreement.

[repo]: https://github.com/simpleclub/firebase-rules-helper
[create pr]: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork
[GitHub hub]: https://hub.github.com
[ssh key]: https://help.github.com/articles/generating-ssh-keys
[CLA]: https://simpleclub.page.link/cla
[versioning]: https://semver.org/
[yarn]: https://classic.yarnpkg.com/en/docs/install/
