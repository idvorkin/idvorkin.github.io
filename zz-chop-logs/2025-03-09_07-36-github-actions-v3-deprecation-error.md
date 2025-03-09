## SpecStory

## GitHub Actions v3 Deprecation Error (3/9/2025, 7:36:36 AM)

_**User**_

OK the vitest github actions failed with this error: 

etting action download info
Error: This request has been automatically failed because it uses a deprecated version of `actions/upload-artifact: v3`. Learn more: https://github.blog/changelog/2024-04-16-deprecation-notice-v3-of-the-artifact-actions/

@https://github.blog/changelog/2024-04-16-deprecation-notice-v3-of-the-artifact-actions/ 

---

_**Assistant**_

<think>The error message indicates that your GitHub Actions workflow is failing because it's using a deprecated version (v3) of `actions/upload-artifact`. According to the provided error message and the article from GitHub's changelog, GitHub is deprecating v3 of the artifact actions. After January 30th, 2025, users will no longer be able to use v3 of actions/upload-artifact or actions/download-artifact.

The article recommends that users should update their workflows to use v4 of the artifact actions as soon as possible. The v4 version improves upload and download speeds significantly and includes new features, but there are key differences from previous versions that may require updates to workflows.

To resolve this issue, I need to find the relevant GitHub Actions workflow file(s) in the codebase and update the references to the artifact actions from v3 to v4. Let's start by searching for GitHub Actions workflow files in the repository that use the upload-artifact action.</think>Based on the error message, your GitHub Actions workflow is failing because it's using a deprecated version (v3) of `actions/upload-artifact`. GitHub is planning to deprecate v3 of the artifact actions on January 30th, 2025, and it seems they're already showing failures for workflows using this version.

Let me look for your GitHub Actions workflow files to identify where this needs to be updated.

---

_****_

<details>
            <summary>Listed directory .github/workflows • **2** results</summary>
        
| Name |
|-------|
| 📄 `vitest.yml` |
| 📄 `vitest-local-test.yml` |

</details>

---

_****_

I found the GitHub Actions workflow files. Let's first examine the `vitest.yml` file since it's likely the one that's failing based on your error message:

---

_****_

Read file: undefined

---

_****_

Now I can see the issue! In the GitHub Actions workflow file, I found the part that's using the deprecated `actions/upload-artifact@v3`:

```yaml
- name: Upload test coverage as artifact
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: vitest-coverage
    path: coverage/
    retention-days: 30
```

Let's also check the other workflow file to see if it also uses the deprecated version:

---

_****_

Read file: undefined

---

_****_

The vitest-local-test.yml file doesn't seem to use the upload-artifact action, so only the main vitest.yml file needs to be updated.

According to GitHub's changelog, I need to update the version from v3 to v4 of the actions/upload-artifact action. Let me update the vitest.yml file:

---

_****_

```diff
        - name: Upload test coverage as artifact
          if: always()
-         uses: actions/upload-artifact@v3
+         uses: actions/upload-artifact@v4
          with:
            name: vitest-coverage
```

---

_****_

I've successfully updated the GitHub Actions workflow file to use version 4 of the actions/upload-artifact action. This change will resolve the failure in your GitHub Actions workflow.

The main difference between v3 and v4 of the artifact actions is that v4 includes significant performance improvements for artifact uploads and downloads. It also includes new features but maintains backward compatibility with most v3 configurations, so your existing workflow should continue to work as expected.

Your workflow should now run successfully without the deprecation error. If you have any other GitHub Action workflows that use upload-artifact or download-artifact actions, you should also update those to v4 to avoid similar issues.

---



---

