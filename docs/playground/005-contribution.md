# Contribute to HEPTAconnect packages

## Why use the playground for contribution?

The playground uses vcs clones to have a central place for packages: the `/repos` directory.
This has multiple advantages:
1. You can place any composer package in that folder, and it is automatically detected
2. You can place also non composer packages in that folder
3. You can have it from any vcs (e.g. git hosted on GitHub)

Looking at the third point we can now easily see that we have a versioned copy of the package.
With a copy at almost root level of the project you can easily apply changes without diving into the depth of a composer vendor folder and can check it working in any playground environment.
Now with the copy being a versioned copy you can commit your changes and prepare a pull request for us to look at.  
