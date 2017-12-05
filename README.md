https://help.github.com/articles/duplicating-a-repository/

Mirroring a repository

Open Git Bash.

Create a bare clone of the repository.

```bash
git clone --bare https://github.com/exampleuser/old-repository.git
```
Mirror-push to the new repository.

```bash
cd old-repository.git
git push --mirror https://github.com/exampleuser/new-repository.git
```
Remove the temporary local repository you created in step 1.

```bash
cd ..
rm -rf old-repository.git
```
