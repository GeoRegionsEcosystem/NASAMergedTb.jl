import{_ as s,o as n,c as e,aA as t}from"./chunks/framework.CgEoSciN.js";const u=JSON.parse('{"title":"Extracting data from existing data into a subGeoRegion","description":"","frontmatter":{},"headers":[],"relativePath":"using/extract.md","filePath":"using/extract.md","lastUpdated":null}'),p={name:"using/extract.md"};function i(o,a,l,c,r,d){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="Extracting-data-from-existing-data-into-a-subGeoRegion" tabindex="-1">Extracting data from existing data into a subGeoRegion <a class="header-anchor" href="#Extracting-data-from-existing-data-into-a-subGeoRegion" aria-label="Permalink to &quot;Extracting data from existing data into a subGeoRegion {#Extracting-data-from-existing-data-into-a-subGeoRegion}&quot;">​</a></h1><p>One of the drawbacks of retrieving data from the OPeNDAP server is that the connection is slower than using the direct-download method. This cost can become especially noticeable when we are attempting to retrieve data for smaller regions of interest, where the lag caused by opening and closing remote datasets can add up and even take a longer time than doing a direct download.</p><p>Thus, drawing upon the functionality of <code>extractGrid()</code> in GeoRegions.jl, we have added in the ability to extract data for a smaller GeoRegion, provided that data for a larger GeoRegion has already been downloaded.</p><p>The extraction of data is as easy as</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extract(</span></span>
<span class="line"><span>    &lt;NASAPrecipitation Dataset&gt;,</span></span>
<span class="line"><span>    &lt;subGeoRegion&gt;,</span></span>
<span class="line"><span>    &lt;parentGeoRegion&gt;,</span></span>
<span class="line"><span>)</span></span></code></pre></div><h3 id="Setup" tabindex="-1">Setup <a class="header-anchor" href="#Setup" aria-label="Permalink to &quot;Setup {#Setup}&quot;">​</a></h3><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>using NASAPrecipitation</span></span>
<span class="line"><span>using CairoMakie</span></span>
<span class="line"><span>using DelimitedFiles</span></span>
<span class="line"><span></span></span>
<span class="line"><span>download(&quot;https://raw.githubusercontent.com/natgeo-wong/GeoPlottingData/main/coastline_resl.txt&quot;,&quot;coast.cst&quot;)</span></span>
<span class="line"><span>coast = readdlm(&quot;coast.cst&quot;,comments=true)</span></span>
<span class="line"><span>clon  = coast[:,1]</span></span>
<span class="line"><span>clat  = coast[:,2]</span></span>
<span class="line"><span>nothing</span></span></code></pre></div><h2 id="An-Example:-Extracting-Data-for-Southeast-Asia-from-a-larger-Tropical-Domain" tabindex="-1">An Example: Extracting Data for Southeast Asia from a larger Tropical Domain <a class="header-anchor" href="#An-Example:-Extracting-Data-for-Southeast-Asia-from-a-larger-Tropical-Domain" aria-label="Permalink to &quot;An Example: Extracting Data for Southeast Asia from a larger Tropical Domain {#An-Example:-Extracting-Data-for-Southeast-Asia-from-a-larger-Tropical-Domain}&quot;">​</a></h2><p>Let&#39;s define the Tropical Domain and download some NASAPrecipitation data for this region:</p><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npd = TRMMMonthly(start=Date(2015),stop=Date(2015))</span></span>
<span class="line"><span>pgeo = RectRegion(&quot;TRP&quot;,&quot;GLB&quot;,&quot;Tropics&quot;,[30,-30,360,0],savegeo=false)</span></span>
<span class="line"><span>download(npd,pgeo)</span></span></code></pre></div><p>We then proceed to define a subGeoRegion, and then extract the data</p><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sgeo = GeoRegion(&quot;AR6_SEA&quot;)</span></span>
<span class="line"><span>extract(npd,sgeo,pgeo)</span></span></code></pre></div><p>Now, let us proceed to compare and contrast the two Regions</p><div class="language-@example vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">@example</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ds = read(npd,pgeo,Date(2015))</span></span>
<span class="line"><span>prcp_pgeo = ds[&quot;precipitation&quot;][:,:,:] * 3600</span></span>
<span class="line"><span>lsd_pgeo  = getLandSea(npd,pgeo)</span></span>
<span class="line"><span>close(ds)</span></span>
<span class="line"><span>ds = read(npd,sgeo,Date(2015))</span></span>
<span class="line"><span>prcp_sgeo = ds[&quot;precipitation&quot;][:,:,:] * 3600</span></span>
<span class="line"><span>lsd_sgeo  = getLandSea(npd,sgeo)</span></span>
<span class="line"><span>close(ds)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fig = Figure()</span></span>
<span class="line"><span>_,_,slon,slat = coordGeoRegion(sgeo)</span></span>
<span class="line"><span>aspect = (maximum(slon)-minimum(slon)+90)/(maximum(slat)-minimum(slat)+30)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ax = Axis(</span></span>
<span class="line"><span>    fig[1,1],width=750,height=750/aspect,</span></span>
<span class="line"><span>    title=&quot;February 2015&quot;,xlabel=&quot;Longitude / º&quot;,ylabel=&quot;Latitude / º&quot;,</span></span>
<span class="line"><span>    limits=(minimum(slon)-45,maximum(slon)+45,minimum(slat)-15,maximum(slat)+15)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>contourf!(</span></span>
<span class="line"><span>    ax,lsd_pgeo.lon,lsd_pgeo.lat,prcp_pgeo[:,:,2],colormap=:Greens,</span></span>
<span class="line"><span>    levels=range(0,0.5,length=11),extendlow=:auto,extendhigh=:auto</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>contourf!(</span></span>
<span class="line"><span>    ax,lsd_sgeo.lon,lsd_sgeo.lat,prcp_sgeo[:,:,2],colormap=:Blues,</span></span>
<span class="line"><span>    levels=range(0,0.5,length=11),extendlow=:auto,extendhigh=:auto</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>lines!(ax,clon,clat,color=:black)</span></span>
<span class="line"><span>lines!(ax,slon,slat,color=:red,linewidth=5)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>resize_to_layout!(fig)</span></span>
<span class="line"><span>fig</span></span></code></pre></div><h2 id="API" tabindex="-1">API <a class="header-anchor" href="#API" aria-label="Permalink to &quot;API {#API}&quot;">​</a></h2><div class="warning custom-block"><p class="custom-block-title">Missing docstring.</p><p>Missing docstring for <code>NASAPrecipitation.extract</code>. Check Documenter&#39;s build log for details.</p></div>`,16)])])}const h=s(p,[["render",i]]);export{u as __pageData,h as default};
