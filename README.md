# geoplatform-demos
Used for various code snippets and demos of GeoPlatform

## Demos Website
This website [geoplatform-demos](https://geoplatform.github.io/geoplatform-demos) 
is run out of the docs folder of the gh-pages branch of this repo. It is built using [GitHub Pages](https://pages.github.com/)
and [Jekyll](https://jekyllrb.com/).

[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) 
is a static site hosting service that takes HTML, CSS, and JavaScript files 
straight from a repository on GitHub, optionally runs the files through a build process (Jekyll in this case), and publishes a website.

[Jeykll](https://jekyllrb.com/) is a simple, blog-aware, static site generator. It has an extensive theme system 
([see GitHub Pages supported themes](https://pages.github.com/themes/)) that allows you 
to leverage community-maintained templates and styles to customize your site’s presentation. Jekyll 
themes specify plugins and package up assets, layouts, includes, and stylesheets in a way that 
can be overridden by your site’s content.

**Notes on installation for building the site locally:**
* For an understanding of GitHub Pages and Jekyll see 
[Creating a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll)
* Also, see the Jekyll documentation for [Understanding gem-based themes](https://jekyllrb.com/docs/themes/#understanding-gem-based-themes). 
This has changed since the GitHub Pages with Jekyll was written. This website uses the [Minima theme](https://github.com/jekyll/minima). 
* Check the [GitHub Pages Dependencies](https://pages.github.com/versions/). Currently, Python 2.7.x is required.
* See [Testing your GitHub Pages site locally with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll) 
for running locally.


**To add demos:**
* Jekyll pages can be created in either [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) or HTML. 
Jekyll converts the Markdown to HTML during the build process.
For an example, see the [QGIS demo](/blob/gh-pages/docs/qgis-example.md).
* For an example off adding JS and CSS to your web page see the [JSFiddle demo](/blob/gh-pages/docs/fiddle-example.md).
* See above for testing your changes locally. After you are satisfied with the changes, 
create a [PR](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) to push the changes to the gh-pages branch.


**In addition to Jekyll, GitHub Pages can be built and deployed using React or Angular**
* [How to deploy React App to GitHub Pages](https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f)
* [Deploy your Angular Project to Github Pages](https://blog.bitsrc.io/deploy-your-angular-project-to-github-pages-7cbacb96f35b)



