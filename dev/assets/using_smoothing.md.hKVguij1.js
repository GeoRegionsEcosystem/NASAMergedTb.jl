import{_ as s,o as n,c as t,aA as e}from"./chunks/framework.CQLR5IVj.js";const m=JSON.parse('{"title":"Spatialtemporal Smoothing of Data","description":"","frontmatter":{},"headers":[],"relativePath":"using/smoothing.md","filePath":"using/smoothing.md","lastUpdated":null}'),l={name:"using/smoothing.md"};function p(i,a,o,c,d,r){return n(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="Spatialtemporal-Smoothing-of-Data" tabindex="-1">Spatialtemporal Smoothing of Data <a class="header-anchor" href="#Spatialtemporal-Smoothing-of-Data" aria-label="Permalink to &quot;Spatialtemporal Smoothing of Data {#Spatialtemporal-Smoothing-of-Data}&quot;">​</a></h1><p>There are options in NASAPrecipitation.jl to spatialtemporally smooth data.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>smoothing(</span></span>
<span class="line"><span>    &lt;NASAPrecipitation Dataset&gt;,</span></span>
<span class="line"><span>    &lt;GeoRegion&gt;,</span></span>
<span class="line"><span>    &lt;smoothing options&gt; ...,</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>It is important to see the documentation and see which options are available for each type of dataset, but we summarize it in the table below:</p><table tabindex="0"><thead><tr><th style="text-align:center;"><code>Type</code></th><th style="text-align:center;">Spatial</th><th style="text-align:center;">Temporal</th></tr></thead><tbody><tr><td style="text-align:center;"><code>IMERGHalfHourly</code></td><td style="text-align:center;">Yes</td><td style="text-align:center;">Yes (specify hours)</td></tr><tr><td style="text-align:center;"><code>IMERGDaily</code></td><td style="text-align:center;">Yes</td><td style="text-align:center;">Yes (specify days)</td></tr><tr><td style="text-align:center;"><code>IMERGMonthly</code></td><td style="text-align:center;">Yes</td><td style="text-align:center;">No</td></tr><tr><td style="text-align:center;"><code>TRMM3Hourly</code></td><td style="text-align:center;">Yes</td><td style="text-align:center;">Yes (specify hours)</td></tr><tr><td style="text-align:center;"><code>TRMMDaily</code></td><td style="text-align:center;">Yes</td><td style="text-align:center;">Yes (specify days)</td></tr><tr><td style="text-align:center;"><code>TRMMMonthly</code></td><td style="text-align:center;">Yes</td><td style="text-align:center;">No</td></tr></tbody></table><h3 id="Setup" tabindex="-1">Setup <a class="header-anchor" href="#Setup" aria-label="Permalink to &quot;Setup {#Setup}&quot;">​</a></h3><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>using NASAPrecipitation</span></span>
<span class="line"><span>using CairoMakie</span></span>
<span class="line"><span>using DelimitedFiles</span></span>
<span class="line"><span></span></span>
<span class="line"><span>download(&quot;https://raw.githubusercontent.com/natgeo-wong/GeoPlottingData/main/coastline_resl.txt&quot;,&quot;coast.cst&quot;)</span></span>
<span class="line"><span>coast = readdlm(&quot;coast.cst&quot;,comments=true)</span></span>
<span class="line"><span>clon  = coast[:,1]</span></span>
<span class="line"><span>clat  = coast[:,2]</span></span>
<span class="line"><span>nothing</span></span></code></pre></div><h2 id="Spatial-Smoothing-Example" tabindex="-1">Spatial Smoothing Example <a class="header-anchor" href="#Spatial-Smoothing-Example" aria-label="Permalink to &quot;Spatial Smoothing Example {#Spatial-Smoothing-Example}&quot;">​</a></h2><p>Let&#39;s define a rectangular domain in Southeast Asia and download some NASAPrecipitation data for this region:</p><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npd = IMERGMonthly(start=Date(2015),stop=Date(2015,3))</span></span>
<span class="line"><span>geo = RectRegion(&quot;TMP&quot;,&quot;GLB&quot;,&quot;Southeast Asia&quot;,[15,-15,125,95],savegeo=false)</span></span>
<span class="line"><span>download(npd,geo)</span></span>
<span class="line"><span>lsd = getLandSea(npd,geo)</span></span></code></pre></div><p>We then proceed to perform a spatial smoothing (1.0º longitude, 0.2º latitude) of the data.</p><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npd_smth = IMERGMonthly(start=Date(2015,2),stop=Date(2015,2))</span></span>
<span class="line"><span>smoothing(npd_smth,geo,smoothlon=1,smoothlat=0.2)</span></span></code></pre></div><p>Now let us compare the difference between the raw and smoothed data.</p><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ds_raw  = read(npd_smth,geo,Date(2015))</span></span>
<span class="line"><span>ds_smth = read(npd_smth,geo,Date(2015),smooth=true,smoothlon=1,smoothlat=0.2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>prcp_raw  = ds_raw[&quot;precipitation&quot;][:,:,11]  * 86400</span></span>
<span class="line"><span>prcp_smth = ds_smth[&quot;precipitation&quot;][:,:,11] * 86400</span></span>
<span class="line"><span></span></span>
<span class="line"><span>close(ds_raw)</span></span>
<span class="line"><span>close(ds_smth)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fig = Figure()</span></span>
<span class="line"><span>aspect = (maximum(lsd.lon)-minimum(lsd.lon)+2)/(maximum(lsd.lat)-minimum(lsd.lat)+2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ax1 = Axis(</span></span>
<span class="line"><span>    fig[1,1],width=350,height=350/aspect,</span></span>
<span class="line"><span>    title=&quot;November 2015 (Raw)&quot;,xlabel=&quot;Longitude / º&quot;,ylabel=&quot;Latitude / º&quot;,</span></span>
<span class="line"><span>    limits=(minimum(lsd.lon)-1,maximum(lsd.lon)+1,minimum(lsd.lat)-1,maximum(lsd.lat)+1)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>ax2 = Axis(</span></span>
<span class="line"><span>    fig[1,2],width=350,height=350/aspect,</span></span>
<span class="line"><span>    title=&quot;November 2015 (Smoothed 1.0ºx0.2º)&quot;,xlabel=&quot;Longitude / º&quot;,</span></span>
<span class="line"><span>    limits=(minimum(lsd.lon)-1,maximum(lsd.lon)+1,minimum(lsd.lat)-1,maximum(lsd.lat)+1)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>contourf!(</span></span>
<span class="line"><span>    ax1,lsd.lon,lsd.lat,prcp_raw,colormap=:Blues,</span></span>
<span class="line"><span>    levels=range(0,20,length=11),extendlow=:auto,extendhigh=:auto</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>contourf!(</span></span>
<span class="line"><span>    ax2,lsd.lon,lsd.lat,prcp_smth,colormap=:Blues,</span></span>
<span class="line"><span>    levels=range(0,20,length=11),extendlow=:auto,extendhigh=:auto</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>lines!(ax1,clon,clat,color=:black)</span></span>
<span class="line"><span>lines!(ax2,clon,clat,color=:black)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>resize_to_layout!(fig)</span></span>
<span class="line"><span>fig</span></span></code></pre></div><p>And we see that the data is smoothed in the longitude-direction. Because they are not smoothed equally in both longitude and latitude, the fields look stretched in the longitude direction.</p><h2 id="API" tabindex="-1">API <a class="header-anchor" href="#API" aria-label="Permalink to &quot;API {#API}&quot;">​</a></h2><div class="warning custom-block"><p class="custom-block-title">Missing docstring.</p><p>Missing docstring for <code>NASAPrecipitation.smoothing</code>. Check Documenter&#39;s build log for details.</p></div>`,17)])])}const u=s(l,[["render",p]]);export{m as __pageData,u as default};
