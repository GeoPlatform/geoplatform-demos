# JSFiddle Example

## Modify a JSFiddle and add it to your web page
This example goes through the steps to modify an [OpenLayers](https://openlayers.org/) JSFiddle demo to use a different tile server. First this we will test our changes in JSFiddle using the embed link. The example will show how to add the JSFiddle to a web page and then show moving HTML, CSS and JS to the web site. 

The steps below will first change the fiddle to use a [zip code layer](https://beta.geoplatform.gov/metadata/895888d3-4f32-5143-88e2-e7b3612891f0) [Vector Tile Service](https://tileservice.geoplatform.gov/?config=edd18cd7_7adc_4428_a6d9_81072155427e&tileType=vector).

1. Go to the OpenLayers [JSFiddle](https://jsfiddle.net/fgdc_gp_demos/dtL1aufb/28/).
![Screenshot from 2021-05-10 17-28-24](https://user-images.githubusercontent.com/64213093/117741688-3ff83380-b1c0-11eb-9422-37b3221a8f06.png)

2. There will be 4 windows displayed. In the JavaScript+JQuery window, change the url to https://tileservice.geoplatform.gov/vector/edd18cd7_7adc_4428_a6d9_81072155427e/{z}/{x}/{y}.mvt.
```
let mvt = new ol.layer.VectorTile({
  declutter: true,
  source: new ol.source.VectorTile({
    format: new ol.format.MVT(),
    url: 'https://tileservice.geoplatform.gov/vector/edd18cd7_7adc_4428_a6d9_81072155427e/{z}/{x}/{y}.mvt',
  }),
  style: style
});
```
3. Click the Run button to load the changes. Now displayed is the zip code layer.
![Screenshot from 2021-05-10 18-50-16](https://user-images.githubusercontent.com/64213093/117741889-b5640400-b1c0-11eb-8b38-475dc792fa2d.png)

4. To make the layer distinguish the layer from the previous layer, change the style color to 0, 0, 0 and the widith to 2. Click Run to load the changes.
```
let style = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'rgb(0, 0, 0)',
    width: 2,
    opacity: 1,
  })
});
```
![Screenshot from 2021-05-10 18-54-28](https://user-images.githubusercontent.com/64213093/117742106-34593c80-b1c1-11eb-935e-ca1754562095.png)

5. Now take a look at the embed button. This will show the embed snippet. You can use this or the iframe to put this in your web page. If you want to save your changes anonymously in the next step, copy and save the embed snippet.
![Screenshot from 2021-05-10 18-55-15](https://user-images.githubusercontent.com/64213093/117742796-b9912100-b1c2-11eb-955b-fe4a2174a2ce.png)

6. When you are satisfied click save to save the changes to a new fiddle. You can save this by signing into your account or you can save it anonymously.
7. If you saved the fiddle anonymously your page will go to the new fiddle with an address like https://jsfiddle.net/nf8142bm/. If you save it to your account it will look more like https://jsfiddle.net/fgdc_gp_demos/dtL1aufb/28/
8. If you saved the changes in your account, then you will have an embed button with the new embed snippet. If not, change the embed snippet you copied earlier to point to the new fiddle.
For example:
```
<script async src="//jsfiddle.net/fgdc_gp_demos/dtL1aufb/28/embed/"></script>
```
Would become:
```
<script async src="//jsfiddle.net/fgdc_gp_demos/nf8142bm/embed/"></script>
```
9. To change the order of the tabs displayed, you can reorder the tabs like this:
```
<script async src="//jsfiddle.net/fgdc_gp_demos/nf8142bm/embed/result,js,css,html"></script>
```
10. To put these on a web page, add the above [script to your page](https://github.com/GeoPlatform/geoplatform-demos/blob/gh-pages/docs/fiddle.html). This example adds the original fiddle and the modified fiddle. These have the JSFiddle navigation.
```
    <!DOCTYPE html>
      <html>
        <body>
          <h1>{{ page.title }}</h1>
          <h2>Openlayer Fiddle example using the National Highway Planning Network (NHPN) tile server.</h2>
          <script async src="//jsfiddle.net/fgdc_gp_demos/dtL1aufb/28/embed/result,js,css,html"></script>
          </br>
          </br>
          <h2>Modified the above Fiddle to use the zip code tile server and anonymously saved</h2>
          <script async src="//jsfiddle.net/fgdc_gp_demos/jo1u0ax6/embed/result,js,css,html"></script>
      </body>
    </html>
```
11. Here is a [Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll) [GitHub Pages](https://pages.github.com/) HTML example.
[Link to example Page](/fiddle.html)
```
    ---
    layout: page
    title: Fiddle Examples
    ---

    <!DOCTYPE html>
    <html>

    <body>

        <h1>{{ page.title }}</h1>

        <h2>Openlayer Fiddle example using the National Highway Planning Network (NHPN) tile server.</h2>
        <script async src="//jsfiddle.net/fgdc_gp_demos/dtL1aufb/28/embed/result,js,css,html"></script>
        </br>
        </br>
        <h2>Modified the above Fiddle to use the zip code tile server and anonymously saved</h2>
        <script async src="//jsfiddle.net/fgdc_gp_demos/jo1u0ax6/embed/result,js,css,html"></script>
    </body>

    </html>
```
![Screenshot from 2021-05-10 19-11-02](https://user-images.githubusercontent.com/64213093/117743209-94e97900-b1c3-11eb-858f-d5d9deb9ceef.png)

12. To move the map to your site from JSFiddle. Create an HTML page with the resources (ol.js, ol.css, and jquery). Then create the css and js file with the information in JSFiddle in your web site's assets.
These are the files in the GitHub Pages test site:
[fiddle-web.html](/fiddle-web.html)
[fiddle.js](/assets/js/fiddle.js)
[fiddle.css](/assets/css/fiddle.css) Since this is no longer using the navigation to other views, I've removed it from the css.
13. Test your changes locally.
14. Push the repo to GitHub
15. This GitHub Pages site is set to run out of the gh-pages branch from the doc directory. The source code is [here](https://github.com/GeoPlatform/geoplatform-demos/tree/gh-pages/docs).
![Screenshot from 2021-05-10 19-13-02](https://user-images.githubusercontent.com/64213093/117743306-c82c0800-b1c3-11eb-9301-848f939aad2b.png)


